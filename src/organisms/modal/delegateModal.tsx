import React, { useState, useEffect } from 'react';
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
import { CHAIN_CONFIG, GUIDE_LINK_DELEGATE } from '../../config';

import { ToggleButton } from '../../components/toggle';

import {
  delegateModalWidth,
  ModalContainer,
  ModalTitle,
  ModalContent,
  ModalLabel,
  ModalInput,
  NextButton,
  InputBoxDefault,
  ModalToggleWrapper,
  ModalTooltipWrapper,
  ModalTooltipIcon,
  ModalTooltipTypo,
  MaxButton,
  HelpIcon,
  ModalInputRowWrap,
  ModalInputWrap,
  ButtonWrapper,
  CancelButton,
  ModalValue,
} from './styles';

const DelegateModal = () => {
  const delegateModalState = useSelector((state: rootState) => state.modal.delegate);
  const modalData = useSelector((state: rootState) => state.modal.data);
  const { balance } = useSelector((state: rootState) => state.user);
  const { isLedger } = useSelector((state: rootState) => state.wallet);
  const { enqueueSnackbar } = useSnackbar();

  const { delegate, getGasEstimationDelegate, setUserData } = useFirma();

  const [amount, setAmount] = useState('');
  const [isActiveButton, setActiveButton] = useState(false);
  const [availableAmount, setAvailableAmount] = useState('');
  const [rewardAmount, setRewardAmount] = useState('');
  const [targetValidator, setTargetValidator] = useState('');
  const [isSafety, setSafety] = useState(true);

  useEffect(() => {
    if (Object.keys(modalData).length > 0) {
      setAvailableAmount(modalData.data.available);
      setRewardAmount(modalData.data.reward);
      setTargetValidator(modalData.data.targetValidator);
      setSafety(modalData.data.available > 0.1);
    }
  }, [modalData]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    onChangeAmount({ target: { value: amount } });
  }, [isSafety]); // eslint-disable-line react-hooks/exhaustive-deps

  const closeModal = () => {
    resetModal();
    modalActions.handleModalDelegate(false);
  };

  const resetModal = () => {
    setAmount('');
  };

  const onClickMaxAmount = () => {
    if (getMaxAmount() > 0) {
      const amount = getMaxAmount().toString();
      setAmount(amount);
      setActiveButton(
        convertNumber(amount) > 0 &&
          convertNumber(amount) <= convertNumber(availableAmount) + convertNumber(rewardAmount)
      );
    }
  };

  const onClickToggle = () => {
    if (convertNumber(availableAmount) > 0.1) {
      setSafety(!isSafety);
    } else {
      setSafety(false);
    }
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
      convertNumber(amount) > 0 && convertNumber(amount) <= convertNumber(availableAmount) + convertNumber(rewardAmount)
    );
  };

  const getMaxAmount = () => {
    const fee = isSafety ? 0.1 : convertToFctNumber(getDefaultFee(isLedger));
    const value = convertNumber(makeDecimalPoint(convertNumber(availableAmount) - fee, 6));

    return value > 0 ? value + convertNumber(rewardAmount) : 0;
  };

  const delegateTx = (resolveTx: () => void, rejectTx: () => void, gas = 0) => {
    delegate(targetValidator, convertNumber(amount), gas)
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
      validatorAddress: targetValidator,
      amount,
    };
  };

  const nextStep = () => {
    closeModal();

    getGasEstimationDelegate(targetValidator, convertNumber(amount))
      .then((gas) => {
        if (convertNumber(balance) - convertNumber(amount) >= convertToFctNumber(getFeesFromGas(gas))) {
          modalActions.handleModalData({
            action: 'Delegate',
            module: '/staking/delegate',
            data: { amount, fees: getFeesFromGas(gas), gas },
            prevModalAction: modalActions.handleModalDelegate,
            txAction: delegateTx,
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
      visible={delegateModalState}
      closable={true}
      onClose={closeModal}
      visibleClose={false}
      width={delegateModalWidth}
    >
      <ModalContainer>
        <ModalTitle>
          Delegate
          <HelpIcon onClick={() => window.open(GUIDE_LINK_DELEGATE)} />
        </ModalTitle>
        <ModalContent>
          <ModalInputRowWrap>
            <ModalLabel>Available</ModalLabel>
            <ModalValue>
              {availableAmount} {CHAIN_CONFIG.PARAMS.SYMBOL}
            </ModalValue>
          </ModalInputRowWrap>
          <ModalInputRowWrap>
            <ModalLabel>Reward </ModalLabel>
            <ModalValue>
              {rewardAmount} {CHAIN_CONFIG.PARAMS.SYMBOL}
            </ModalValue>
          </ModalInputRowWrap>
          <ModalInputRowWrap>
            <ModalLabel>Fee estimation</ModalLabel>
            <ModalValue>{`${convertToFctString(getDefaultFee(isLedger).toString())} ${
              CHAIN_CONFIG.PARAMS.SYMBOL
            }`}</ModalValue>
          </ModalInputRowWrap>
          <ModalInputWrap>
            <ModalLabel>Amount</ModalLabel>
            <ModalInput style={{ marginBottom: '10px' }}>
              <MaxButton active={getMaxAmount() > 0} onClick={onClickMaxAmount}>
                Max
              </MaxButton>
              <InputBoxDefault type='text' placeholder='0' value={amount} onChange={onChangeAmount} />
            </ModalInput>
          </ModalInputWrap>

          <ModalToggleWrapper>
            <ToggleButton toggleText='Safety' isActive={isSafety} onClickToggle={onClickToggle} />
            {isSafety && (
              <ModalTooltipWrapper>
                <ModalTooltipIcon />
                <ModalTooltipTypo>
                  The entire amount is automatically entered except 0.1{CHAIN_CONFIG.PARAMS.SYMBOL}, which will be used
                  as a transaction fee.
                </ModalTooltipTypo>
              </ModalTooltipWrapper>
            )}
          </ModalToggleWrapper>

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

export default React.memo(DelegateModal);
