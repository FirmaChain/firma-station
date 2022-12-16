import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';

import useFirma from '../../utils/wallet';
import {
  convertNumber,
  convertToFctNumber,
  convertToFctString,
  getFeesFromGas,
  makeDecimalPoint,
} from '../../utils/common';
import { rootState } from '../../redux/reducers';
import { Modal } from '../../components/modal';
import { modalActions } from '../../redux/action';
import { CHAIN_CONFIG } from '../../config';

import {
  depositModalWidth,
  ModalContainer,
  ModalTitle,
  ModalContent,
  ModalLabel,
  ModalInput,
  NextButton,
  InputBoxDefault,
} from './styles';

const DepositModal = () => {
  const depositModalState = useSelector((state: rootState) => state.modal.deposit);
  const modalData = useSelector((state: rootState) => state.modal.data);
  const { balance } = useSelector((state: rootState) => state.user);
  const { enqueueSnackbar } = useSnackbar();

  const { deposit, getGasEstimationDeposit, setUserData } = useFirma();

  const [amount, setAmount] = useState('');
  const [isActiveButton, setActiveButton] = useState(false);

  const closeModal = () => {
    resetModal();
    modalActions.handleModalDeposit(false);
  };

  const resetModal = () => {
    setAmount('');
  };

  const onChangeAmount = (e: any) => {
    const { value } = e.target;

    let amount: string = value.replace(/[^0-9.]/g, '');

    if (amount === '') {
      setAmount('');
      return;
    }

    const pattern = /(^\d+$)|(^\d{1,}.\d{0,6}$)/;

    if (!pattern.test(amount)) {
      amount = makeDecimalPoint(convertNumber(amount), 6);
    }

    if (convertNumber(amount) > getMaxAmount()) {
      amount = getMaxAmount().toString();
    }

    setAmount(amount);
    setActiveButton(convertNumber(amount) > 0 && convertNumber(amount) <= getMaxAmount());
  };

  const getMaxAmount = () => {
    const value = convertNumber(
      makeDecimalPoint(convertNumber(balance) - convertToFctNumber(CHAIN_CONFIG.FIRMACHAIN_CONFIG.defaultFee), 6)
    );
    return value > 0 ? value : 0;
  };

  const depositTx = (resolveTx: () => void, rejectTx: () => void, gas = 0) => {
    deposit(modalData.proposalId, convertNumber(amount), gas)
      .then(() => {
        setUserData();
        resolveTx();
      })
      .catch(() => {
        rejectTx();
      });
  };

  const nextStep = () => {
    closeModal();

    getGasEstimationDeposit(modalData.proposalId, convertNumber(amount))
      .then((gas) => {
        if (convertNumber(balance) - convertNumber(amount) >= convertToFctNumber(getFeesFromGas(gas))) {
          modalActions.handleModalData({
            action: 'Deposit',
            data: { amount, fees: getFeesFromGas(gas), gas },
            prevModalAction: modalActions.handleModalDeposit,
            txAction: depositTx,
          });

          modalActions.handleModalConfirmTx(true);
        } else {
          enqueueSnackbar('Insufficient funds. Please check your account balance.', {
            variant: 'error',
            autoHideDuration: 2000,
          });
        }
      })
      .catch((e) => {
        enqueueSnackbar(e, {
          variant: 'error',
          autoHideDuration: 5000,
        });
      });
  };

  return (
    <Modal visible={depositModalState} closable={true} onClose={closeModal} width={depositModalWidth}>
      <ModalContainer>
        <ModalTitle>DEPOSIT</ModalTitle>
        <ModalContent>
          <ModalLabel>Available</ModalLabel>
          <ModalInput>
            {balance} {CHAIN_CONFIG.PARAMS.SYMBOL}
          </ModalInput>

          <ModalLabel>Fee estimation</ModalLabel>
          <ModalInput>{`${convertToFctString(CHAIN_CONFIG.FIRMACHAIN_CONFIG.defaultFee.toString())} ${
            CHAIN_CONFIG.PARAMS.SYMBOL
          }`}</ModalInput>

          <ModalLabel>Amount</ModalLabel>
          <ModalInput>
            <InputBoxDefault type='text' placeholder='0' value={amount} onChange={onChangeAmount} />
          </ModalInput>
          <NextButton
            onClick={() => {
              if (isActiveButton) nextStep();
            }}
            active={isActiveButton}
          >
            Next
          </NextButton>
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
};

export default React.memo(DepositModal);
