import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';

import useFirma from '../../utils/wallet';
import { rootState } from '../../redux/reducers';
import {
  convertNumber,
  convertNumberFormat,
  convertToFctNumber,
  convertToFctString,
  getDefaultFee,
  getFeesFromGas,
  isValid,
  makeDecimalPoint,
} from '../../utils/common';
import { Modal } from '../../components/modal';
import { modalActions } from '../../redux/action';
import { CHAIN_CONFIG, GUIDE_LINK_UNDELEGATE } from '../../config';

import {
  undelegateModalWidth,
  ModalContainer,
  ModalTitle,
  ModalContent,
  ModalLabel,
  ModalInput,
  NextButton,
  InputBoxDefault,
  ModalTooltipWrapper,
  ModalTooltipIcon,
  ModalTooltipTypo,
  MaxButton,
  HelpIcon,
  ModalInputWrap,
  ModalInputRowWrap,
  CancelButton,
  ButtonWrapper,
  ModalValue,
} from './styles';

const UndelegateModal = () => {
  const undelegateModalState = useSelector((state: rootState) => state.modal.undelegate);
  const modalData = useSelector((state: rootState) => state.modal.data);
  const { balance } = useSelector((state: rootState) => state.user);
  const { isLedger, isMobileApp } = useSelector((state: rootState) => state.wallet);
  const { enqueueSnackbar } = useSnackbar();
  const { undelegate, getGasEstimationUndelegate, setUserData } = useFirma();

  const [amount, setAmount] = useState('');
  const [isActiveButton, setActiveButton] = useState(false);

  const [availableAmount, setAvailableAmount] = useState('');

  useEffect(() => {
    setAvailableAmount(
      isValid(modalData.data) ? convertNumberFormat(convertToFctNumber(modalData.data.delegation.amount), 3) : '0'
    );
  }, [undelegateModalState]); // eslint-disable-line react-hooks/exhaustive-deps

  const closeModal = () => {
    resetModal();
    modalActions.handleModalUndelegate(false);
  };

  const resetModal = () => {
    setAmount('');
  };

  const onClickMaxAmount = () => {
    const amount = getMaxAmount().toString();
    setAmount(amount);
    setActiveButton(
      convertNumber(amount) > 0 && convertNumber(amount) <= convertToFctNumber(modalData.data.delegation.amount)
    );
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
    setActiveButton(
      convertNumber(amount) > 0 && convertNumber(amount) <= convertToFctNumber(modalData.data.delegation.amount)
    );
  };

  const getMaxAmount = () => {
    return convertToFctNumber(modalData.data.delegation.amount);
  };

  const undelegateTx = (resolveTx: () => void, rejectTx: () => void, gas = 0) => {
    undelegate(modalData.data.targetValidator, convertNumber(amount), gas)
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
      validatorAddress: modalData.data.targetValidator,
      amount,
    };
  };

  const nextStep = () => {
    closeModal();

    getGasEstimationUndelegate(modalData.data.targetValidator, convertNumber(amount))
      .then((gas) => {
        if (convertNumber(balance) >= convertToFctNumber(getFeesFromGas(gas))) {
          modalActions.handleModalData({
            action: 'Undelegate',
            module: '/staking/undelegate',
            data: { amount: amount, fees: getFeesFromGas(gas), gas },
            prevModalAction: modalActions.handleModalUndelegate,
            txAction: undelegateTx,
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
      visible={undelegateModalState}
      closable={true}
      visibleClose={false}
      onClose={closeModal}
      width={undelegateModalWidth}
    >
      <ModalContainer>
        <ModalTitle>
          Undelegate
          <HelpIcon onClick={() => window.open(GUIDE_LINK_UNDELEGATE)} />
        </ModalTitle>
        <ModalContent>
          <ModalInputRowWrap>
            <ModalLabel>Available</ModalLabel>
            <ModalValue>
              {availableAmount} {CHAIN_CONFIG.PARAMS.SYMBOL}
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
              <MaxButton active={true} onClick={onClickMaxAmount}>
                Max
              </MaxButton>
              <InputBoxDefault type='text' placeholder='0' value={amount} onChange={onChangeAmount} />
            </ModalInput>
          </ModalInputWrap>

          <ModalTooltipWrapper>
            <ModalTooltipIcon />
            <ModalTooltipTypo>
              A 21 day period is required when undelegating your tokens. During the 21 day period, you will not receive
              any rewards. And you can't send and delegate that amount during 21 days.
            </ModalTooltipTypo>
          </ModalTooltipWrapper>

          <ModalTooltipWrapper>
            <ModalTooltipIcon />
            <ModalTooltipTypo>
              A maximum of 7 undelegations are allowed per validator during the 21 day link period.
            </ModalTooltipTypo>
          </ModalTooltipWrapper>

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

export default React.memo(UndelegateModal);
