import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';

import useFirma from '../../utils/wallet';
import {
  convertNumber,
  convertToFctNumber,
  convertToFctString,
  getDefaultFee,
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
  ButtonWrapper,
  CancelButton,
  ModalInputRowWrap,
  ModalInputWrap,
  ModalValue,
} from './styles';

const DepositModal = () => {
  const depositModalState = useSelector((state: rootState) => state.modal.deposit);
  const modalData = useSelector((state: rootState) => state.modal.data);
  const { balance } = useSelector((state: rootState) => state.user);
  const { isLedger, isMobileApp } = useSelector((state: rootState) => state.wallet);
  const { enqueueSnackbar } = useSnackbar();

  const { deposit, getGasEstimationDeposit, setUserData } = useFirma();

  const [amount, setAmount] = useState('');
  const [proposalId, setProposalId] = useState(-1);
  const [isActiveButton, setActiveButton] = useState(false);

  useEffect(() => {
    setProposalId(modalData.proposalId);
  }, [depositModalState]); // eslint-disable-line react-hooks/exhaustive-deps

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
      makeDecimalPoint(convertNumber(balance) - convertToFctNumber(getDefaultFee(isLedger, isMobileApp)), 6)
    );
    return value > 0 ? value : 0;
  };

  const depositTx = (resolveTx: () => void, rejectTx: () => void, gas = 0) => {
    deposit(proposalId, convertNumber(amount), gas)
      .then(() => {
        setUserData();
        resolveTx();
      })
      .catch(() => {
        rejectTx();
      });
  };

  const getParamsTx = () => {
    return {
      proposalId,
      amount,
    };
  };

  const nextStep = () => {
    closeModal();

    getGasEstimationDeposit(proposalId, convertNumber(amount))
      .then((gas) => {
        if (convertNumber(balance) - convertNumber(amount) >= convertToFctNumber(getFeesFromGas(gas))) {
          modalActions.handleModalData({
            action: 'Deposit',
            module: '/gov/deposit',
            data: { amount, fees: getFeesFromGas(gas), gas },
            prevModalAction: modalActions.handleModalDeposit,
            txAction: depositTx,
            txParams: getParamsTx,
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
    <Modal
      visible={depositModalState}
      closable={true}
      visibleClose={false}
      onClose={closeModal}
      width={depositModalWidth}
    >
      <ModalContainer>
        <ModalTitle>Deposit</ModalTitle>
        <ModalContent>
          <ModalInputRowWrap>
            <ModalLabel>Available</ModalLabel>
            <ModalValue>
              {balance} {CHAIN_CONFIG.PARAMS.SYMBOL}
            </ModalValue>
          </ModalInputRowWrap>

          <ModalInputRowWrap>
            <ModalLabel>Fee estimation</ModalLabel>
            <ModalValue>{`${convertToFctString(getDefaultFee(isLedger, isMobileApp).toString())} ${
              CHAIN_CONFIG.PARAMS.SYMBOL
            }`}</ModalValue>
          </ModalInputRowWrap>

          <ModalInputWrap>
            <ModalLabel>Amount</ModalLabel>
            <ModalInput>
              <InputBoxDefault type='text' placeholder='0' value={amount} onChange={onChangeAmount} />
            </ModalInput>
          </ModalInputWrap>

          <ButtonWrapper>
            <CancelButton onClick={() => closeModal()} status={1}>
              Cancel
            </CancelButton>
            <NextButton
              onClick={() => {
                if (isActiveButton) nextStep();
              }}
              status={isActiveButton ? 0 : 2}
            >
              Next
            </NextButton>
          </ButtonWrapper>
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
};

export default React.memo(DepositModal);
