import React, { useEffect, useState, useRef } from 'react';
import Select from 'react-select';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';

import useFirma from '../../utils/wallet';
import { rootState } from '../../redux/reducers';
import { Modal } from '../../components/modal';
import { modalActions } from '../../redux/action';

import { ToggleButton } from '../../components/toggle';
import { DENOM, FIRMACHAIN_CONFIG, GUIDE_LINK_SEND, SYMBOL } from '../../config';

import {
  sendModalWidth,
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
  HelpIcon,
} from './styles';
import {
  convertNumber,
  convertToFctNumber,
  convertToFctString,
  getFeesFromGas,
  makeDecimalPoint,
} from '../../utils/common';

import styled from 'styled-components';

const SelectWrapper = styled.div`
  width: 100%;
  margin-bottom: 20px;
`;

const customStyles = {
  control: (provided: any) => ({
    ...provided,
    backgroundColor: '#21212f',
    border: '1px solid #696974',
  }),
  option: (provided: any) => ({
    ...provided,
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: 'white',
  }),
  indicatorSeparator: (provided: any) => ({
    ...provided,
    color: '#324ab8aa',
    backgroundColor: '#324ab8aa',
  }),
  dropdownIndicator: (provided: any) => ({
    ...provided,
    color: '#324ab8aa',
  }),
};

const SendModal = () => {
  const sendModalState = useSelector((state: rootState) => state.modal.send);
  const { balance, tokenList } = useSelector((state: rootState) => state.user);
  const { isLedger } = useSelector((state: rootState) => state.wallet);
  const { sendFCT, sendToken, getGasEstimationSendFCT, getGasEstimationsendToken, isValidAddress, setUserData } =
    useFirma();
  const { enqueueSnackbar } = useSnackbar();

  const [available, setAvailable] = useState(0);
  const [tokenData, setTokenData] = useState({
    symbol: '',
    denom: '',
    decimal: 6,
  });
  const [amount, setAmount] = useState('');
  const [targetAddress, setTargetAddress] = useState('');
  const [memo, setMemo] = useState('');
  const [isActiveButton, setActiveButton] = useState(false);
  const [isSafety, setSafety] = useState(true);

  const selectInputRef = useRef<any>();

  const closeModal = () => {
    resetModal();
    modalActions.handleModalSend(false);
  };

  const resetModal = () => {
    setAmount('');
  };

  useEffect(() => {
    checkParams();
  }, [amount, targetAddress, memo]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    onChangeAmount({ target: { value: amount } });
  }, [isSafety]); // eslint-disable-line react-hooks/exhaustive-deps

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
  };

  const onChangeTargetAddress = (e: any) => {
    const { value } = e.target;
    const address = value.replace(/ /g, '');

    setTargetAddress(address);
  };

  const onChangeMemo = (e: any) => {
    const { value } = e.target;

    setMemo(value);
  };

  const onChangeSymbol = (e: any) => {
    if (e == null) return;
    const { value, balance, decimal, denom } = e;
    setAvailable(balance);
    setTokenData({ symbol: value, decimal: decimal, denom: denom });
    setSafety(balance > 0.1);
  };

  const onClickToggle = () => {
    if (available > 0.1) {
      setSafety(!isSafety);
    } else {
      setSafety(false);
    }
  };

  const checkParams = () => {
    setActiveButton(
      targetAddress !== '' &&
        isValidAddress(targetAddress) &&
        amount !== '' &&
        convertNumber(amount) <= convertNumber(available) &&
        convertNumber(amount) > 0
    );
  };

  const getMaxAmount = (): Number => {
    if (tokenData.symbol === SYMBOL) {
      const fee = isSafety ? 0.1 : convertToFctNumber(FIRMACHAIN_CONFIG.defaultFee);

      const value = convertNumber(makeDecimalPoint(available - fee, 6));
      return value > 0 ? value : 0;
    } else {
      return available;
    }
  };

  const sendTx = (resolveTx: () => void, rejectTx: () => void, gas = 0) => {
    if (tokenData.symbol === SYMBOL) {
      sendFCT(targetAddress, amount, memo, gas)
        .then(() => {
          setUserData();
          resolveTx();
        })
        .catch(() => {
          rejectTx();
        });
    } else {
      sendToken(targetAddress, amount, tokenData.denom, tokenData.decimal, memo, gas)
        .then(() => {
          setUserData();
          resolveTx();
        })
        .catch(() => {
          rejectTx();
        });
    }
  };

  const nextStep = () => {
    if (isLedger) modalActions.handleModalGasEstimation(true);

    closeModal();

    if (tokenData.symbol === SYMBOL) {
      getGasEstimationSendFCT(targetAddress, amount, memo)
        .then((gas) => {
          if (isLedger) modalActions.handleModalGasEstimation(false);

          modalActions.handleModalData({
            action: 'Send',
            data: { amount, fees: getFeesFromGas(gas), gas },
            prevModalAction: modalActions.handleModalSend,
            txAction: sendTx,
          });

          modalActions.handleModalConfirmTx(true);
        })
        .catch(() => {
          if (isLedger) {
            enqueueSnackbar('Gas estimate failed. Please check your ledger.', {
              variant: 'error',
              autoHideDuration: 3000,
            });
            modalActions.handleModalGasEstimation(false);
          }
        });
    } else {
      getGasEstimationsendToken(targetAddress, amount, tokenData.denom, tokenData.decimal, memo)
        .then((gas) => {
          if (isLedger) modalActions.handleModalGasEstimation(false);

          modalActions.handleModalData({
            action: 'Send',
            data: { amount, fees: getFeesFromGas(gas), gas },
            prevModalAction: modalActions.handleModalSend,
            txAction: sendTx,
          });

          modalActions.handleModalConfirmTx(true);
        })
        .catch(() => {
          if (isLedger) {
            enqueueSnackbar('Gas estimate failed. Please check your ledger.', {
              variant: 'error',
              autoHideDuration: 3000,
            });
            modalActions.handleModalGasEstimation(false);
          }
        });
    }
  };

  return (
    <Modal visible={sendModalState} closable={true} onClose={closeModal} width={sendModalWidth}>
      <ModalContainer>
        <ModalTitle>
          SEND
          <HelpIcon onClick={() => window.open(GUIDE_LINK_SEND)} />
        </ModalTitle>
        <ModalContent>
          <ModalLabel>Symbol</ModalLabel>
          <SelectWrapper>
            <Select
              options={[
                { value: SYMBOL, label: SYMBOL, balance: balance, decimal: 6, denom: DENOM },
                ...tokenList.map((value) => {
                  return {
                    value: value.symbol,
                    label: value.symbol,
                    balance: value.balance,
                    decimal: value.decimal,
                    denom: value.denom,
                  };
                }),
              ]}
              styles={customStyles}
              onChange={onChangeSymbol}
              ref={selectInputRef}
            />
          </SelectWrapper>

          <ModalLabel>Send To</ModalLabel>
          <ModalInput>
            <InputBoxDefault
              type='text'
              placeholder='Wallet Address'
              value={targetAddress}
              onChange={onChangeTargetAddress}
            />
          </ModalInput>

          <ModalLabel>Available</ModalLabel>
          <ModalInput>
            {available} {tokenData.symbol}
          </ModalInput>

          <ModalLabel>Fee estimation</ModalLabel>
          <ModalInput>{`${convertToFctString(FIRMACHAIN_CONFIG.defaultFee.toString())} FCT`}</ModalInput>

          <ModalLabel>Amount</ModalLabel>
          <ModalInput style={{ marginBottom: '10px' }}>
            <InputBoxDefault type='text' placeholder='0' value={amount} onChange={onChangeAmount} />
          </ModalInput>
          {tokenData.symbol && tokenData.symbol === SYMBOL && (
            <ModalToggleWrapper>
              <ToggleButton toggleText='Safety' isActive={isSafety} onClickToggle={onClickToggle} />
              {isSafety && (
                <ModalTooltipWrapper>
                  <ModalTooltipIcon />
                  <ModalTooltipTypo>
                    The entire amount is automatically entered except 0.1{SYMBOL}, which will be used as a transaction
                    fee.
                  </ModalTooltipTypo>
                </ModalTooltipWrapper>
              )}
            </ModalToggleWrapper>
          )}

          <ModalLabel>Memo (optional)</ModalLabel>
          <ModalInput>
            <InputBoxDefault type='text' placeholder='' value={memo} onChange={onChangeMemo} />
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

export default React.memo(SendModal);
