import React, { useState, useRef, useEffect } from 'react';
import Select from 'react-select';
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
  makeDecimalPoint,
} from '../../utils/common';
import { Modal } from '../../components/modal';
import { modalActions } from '../../redux/action';
import { CHAIN_CONFIG, GUIDE_LINK_REDELEGATE } from '../../config';

import {
  redelegateModalWidth,
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
  ModalInputRowWrap,
  ButtonWrapper,
  CancelButton,
  ModalValue,
} from './styles';

import styled from 'styled-components';

const SelectWrapper = styled.div`
  width: 100%;
  margin-bottom: 30px;
`;

const customStyles = {
  control: (provided: any) => ({
    ...provided,
    backgroundColor: '#3d3b48',
    border: '1px solid #ffffff00 !important',
    borderRadius: '0',
    boxShadow: 'none',
  }),
  option: (provided: any) => ({
    ...provided,
    color: '#ccc',
    backgroundColor: '#3d3b48',
    borderRadius: '0',
    paddingTop: '12px',
    paddingBottom: '12px',
    '&:hover': {
      backgroundColor: '#3d3b48',
    },
  }),
  indicatorSeparator: (provided: any) => ({
    ...provided,
    color: '#888',
    backgroundColor: '#888',
  }),
  dropdownIndicator: (provided: any) => ({
    ...provided,
    color: '#888',
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: 'white',
  }),
  menuList: (provided: any) => ({
    ...provided,
    backgroundColor: '#3d3b48',
    borderRadius: '0',
    margin: '0',
    padding: '0',
  }),
};

const RedelegateModal = () => {
  const redelegateModalState = useSelector((state: rootState) => state.modal.redelegate);
  const modalData = useSelector((state: rootState) => state.modal.data);
  const { balance } = useSelector((state: rootState) => state.user);
  const { isLedger, isMobileApp } = useSelector((state: rootState) => state.wallet);
  const { enqueueSnackbar } = useSnackbar();

  const { redelegate, getGasEstimationRedelegate, setUserData } = useFirma();

  const [amount, setAmount] = useState('');
  const [isActiveButton, setActiveButton] = useState(false);
  const [sourceValidator, setSourceValidator] = useState('');
  const [sourceAmount, setSourceAmount] = useState(0);
  const [delegationList, setDelegationList] = useState([]);
  const [targetValidator, setTargetValidator] = useState('');

  const selectInputRef = useRef<any>();

  useEffect(() => {
    if (Object.keys(modalData).length > 0) {
      setDelegationList(modalData.data.delegationList);
      setTargetValidator(modalData.data.targetValidator);
    }
  }, [redelegateModalState]); // eslint-disable-line react-hooks/exhaustive-deps

  const closeModal = () => {
    resetModal();
    modalActions.handleModalRedelegate(false);
  };

  const resetModal = () => {
    selectInputRef.current.clearValue();
    setActiveButton(false);
    setAmount('');
    setSourceValidator('');
    setSourceAmount(0);
  };

  const onClickMaxAmount = () => {
    const amount = getMaxAmount().toString();
    setAmount(amount);
    setActiveButton(convertNumber(amount) > 0 && convertNumber(amount) <= sourceAmount);
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
    setActiveButton(convertNumber(amount) > 0 && convertNumber(amount) <= sourceAmount);
  };

  const getMaxAmount = () => {
    return sourceAmount;
  };

  const redelegateTx = (resolveTx: () => void, rejectTx: () => void, gas = 0) => {
    redelegate(sourceValidator, targetValidator, convertNumber(amount), gas)
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
      validatorSrcAddress: sourceValidator,
      validatorDstAddress: targetValidator,
      amount,
    };
  };

  const onChangeValidator = (e: any) => {
    if (e == null) return;
    const { value, amount } = e;

    setAmount('');
    setSourceValidator(value);
    setSourceAmount(convertToFctNumber(amount));
  };

  const nextStep = () => {
    closeModal();

    getGasEstimationRedelegate(sourceValidator, targetValidator, convertNumber(amount))
      .then((gas) => {
        if (convertNumber(balance) >= convertToFctNumber(getFeesFromGas(gas))) {
          modalActions.handleModalData({
            action: 'Redelegate',
            module: '/staking/redelegate',
            data: { amount, fees: getFeesFromGas(gas), gas },
            prevModalAction: modalActions.handleModalRedelegate,
            txAction: redelegateTx,
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
      visible={redelegateModalState}
      closable={true}
      visibleClose={false}
      onClose={closeModal}
      width={redelegateModalWidth}
    >
      <ModalContainer>
        <ModalTitle>
          Redelegate
          <HelpIcon onClick={() => window.open(GUIDE_LINK_REDELEGATE)} />
        </ModalTitle>
        <ModalContent>
          <ModalLabel>Source Validator</ModalLabel>
          <SelectWrapper>
            <Select
              options={delegationList.filter((v: any) => v.value !== targetValidator)}
              styles={customStyles}
              onChange={onChangeValidator}
              ref={selectInputRef}
            />
          </SelectWrapper>
          {sourceValidator && (
            <>
              <ModalInputRowWrap>
                <ModalLabel>Available</ModalLabel>
                <ModalValue>
                  {convertNumberFormat(sourceAmount, 3)} {CHAIN_CONFIG.PARAMS.SYMBOL}
                </ModalValue>
              </ModalInputRowWrap>

              <ModalInputRowWrap>
                <ModalLabel>Fee estimation</ModalLabel>
                <ModalValue>{`${convertToFctString((getDefaultFee(isLedger, isMobileApp) + 5000).toString())} ${
                  CHAIN_CONFIG.PARAMS.SYMBOL
                }`}</ModalValue>
              </ModalInputRowWrap>

              <ModalLabel>Amount</ModalLabel>
              <ModalInput>
                <MaxButton active={true} onClick={onClickMaxAmount}>
                  Max
                </MaxButton>
                <InputBoxDefault type='text' placeholder='0' onChange={onChangeAmount} value={amount} />
              </ModalInput>
            </>
          )}

          <ModalTooltipWrapper>
            <ModalTooltipIcon />
            <ModalTooltipTypo>Redelegated supply will be linked for a period of 21 days.</ModalTooltipTypo>
          </ModalTooltipWrapper>
          <ModalTooltipWrapper>
            <ModalTooltipIcon />
            <ModalTooltipTypo>A maximum of 7 redelegations are allowed.</ModalTooltipTypo>
          </ModalTooltipWrapper>
          <ModalTooltipWrapper>
            <ModalTooltipIcon />
            <ModalTooltipTypo>
              Until the 21 day link period passes, you cannot redelegate your redelgated supply to another validator.
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

export default React.memo(RedelegateModal);
