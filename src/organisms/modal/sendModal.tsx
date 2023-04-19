import React, { useEffect, useState, useRef } from 'react';
import Select from 'react-select';
import { useSelector } from 'react-redux';

import useFirma from '../../utils/wallet';
import { rootState } from '../../redux/reducers';
import { Modal } from '../../components/modal';
import { modalActions } from '../../redux/action';

import { ToggleButton } from '../../components/toggle';
import { CHAIN_CONFIG, GUIDE_LINK_SEND } from '../../config';

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
  ModalInputWrap,
  ModalInputRowWrap,
  ButtonWrapper,
  CancelButton,
  ModalValue,
} from './styles';
import {
  convertNumber,
  convertToFctNumber,
  convertToFctString,
  getDefaultFee,
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

const SendModal = () => {
  const sendModalState = useSelector((state: rootState) => state.modal.send);
  const { balance, tokenList } = useSelector((state: rootState) => state.user);
  const { isLedger, isMobileApp } = useSelector((state: rootState) => state.wallet);

  const { sendFCT, sendToken, getGasEstimationSendFCT, getGasEstimationsendToken, isValidAddress, setUserData } =
    useFirma();

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

  useEffect(() => {
    setAvailable(convertNumber(balance));
    setTokenData({ symbol: CHAIN_CONFIG.PARAMS.SYMBOL, decimal: 6, denom: CHAIN_CONFIG.PARAMS.DENOM });
    setSafety(convertNumber(balance) > 0.1);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
    if (tokenData.symbol === CHAIN_CONFIG.PARAMS.SYMBOL) {
      const fee = isSafety ? 0.1 : convertToFctNumber(getDefaultFee(isLedger, isMobileApp));

      const value = convertNumber(makeDecimalPoint(available - fee, 6));
      return value > 0 ? value : 0;
    } else {
      return available;
    }
  };

  const sendTx = (resolveTx: () => void, rejectTx: () => void, gas = 0) => {
    if (tokenData.symbol === CHAIN_CONFIG.PARAMS.SYMBOL) {
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

  const getParamsTx = () => {
    if (tokenData.symbol === CHAIN_CONFIG.PARAMS.SYMBOL) {
      return {
        address: targetAddress,
        amount,
        memo,
      };
    } else {
      return {
        address: targetAddress,
        amount,
        denom: tokenData.denom,
        decimal: tokenData.decimal,
        memo,
      };
    }
  };

  const nextStep = () => {
    closeModal();

    if (tokenData.symbol === CHAIN_CONFIG.PARAMS.SYMBOL) {
      getGasEstimationSendFCT(targetAddress, amount, memo)
        .then((gas) => {
          modalActions.handleModalData({
            action: 'Send',
            module: '/bank/send',
            data: { amount, fees: getFeesFromGas(gas), gas },
            prevModalAction: modalActions.handleModalSend,
            txAction: sendTx,
            txParams: getParamsTx,
          });

          modalActions.handleModalConfirmTx(true);
        })
        .catch(() => {});
    } else {
      getGasEstimationsendToken(targetAddress, amount, tokenData.denom, tokenData.decimal, memo)
        .then((gas) => {
          modalActions.handleModalData({
            action: 'Send',
            module: '/bank/sendToken',
            data: { amount, fees: getFeesFromGas(gas), gas },
            prevModalAction: modalActions.handleModalSend,
            txAction: sendTx,
            txParams: getParamsTx,
          });

          modalActions.handleModalConfirmTx(true);
        })
        .catch(() => {});
    }
  };

  return (
    <Modal visible={sendModalState} closable={true} visibleClose={false} onClose={closeModal} width={sendModalWidth}>
      <ModalContainer>
        <ModalTitle>
          Send
          <HelpIcon onClick={() => window.open(GUIDE_LINK_SEND)} />
        </ModalTitle>
        <ModalContent>
          <ModalInputWrap>
            <ModalLabel>Send To</ModalLabel>
            <ModalInput>
              <InputBoxDefault
                type='text'
                placeholder='Wallet Address'
                value={targetAddress}
                onChange={onChangeTargetAddress}
              />
            </ModalInput>
          </ModalInputWrap>

          <ModalInputWrap>
            <ModalLabel>Symbol</ModalLabel>
            <SelectWrapper>
              <Select
                options={[
                  {
                    value: CHAIN_CONFIG.PARAMS.SYMBOL,
                    label: CHAIN_CONFIG.PARAMS.SYMBOL,
                    balance: balance,
                    decimal: 6,
                    denom: CHAIN_CONFIG.PARAMS.DENOM,
                  },
                  ...tokenList.map((value) => {
                    return {
                      value: value.symbol,
                      label: value.symbol,
                      balance: value.balance.toString(),
                      decimal: value.decimal,
                      denom: value.denom,
                    };
                  }),
                ]}
                styles={customStyles}
                onChange={onChangeSymbol}
                defaultValue={{
                  value: CHAIN_CONFIG.PARAMS.SYMBOL,
                  balance: balance,
                  decimal: 6,
                  denom: CHAIN_CONFIG.PARAMS.DENOM,
                  label: CHAIN_CONFIG.PARAMS.SYMBOL,
                }}
                ref={selectInputRef}
              />
            </SelectWrapper>
          </ModalInputWrap>

          {tokenData && tokenData.symbol && (
            <>
              <ModalInputRowWrap>
                <ModalLabel>Available</ModalLabel>
                <ModalValue>
                  {available} {tokenData.symbol}
                </ModalValue>
              </ModalInputRowWrap>

              <ModalInputRowWrap>
                <ModalLabel>Fee estimation</ModalLabel>
                <ModalValue>{`${convertToFctString(getDefaultFee(isLedger, isMobileApp).toString())} FCT`}</ModalValue>
              </ModalInputRowWrap>
            </>
          )}

          <ModalInputWrap>
            <ModalLabel>Amount</ModalLabel>
            <ModalInput style={{ marginBottom: '10px' }}>
              <InputBoxDefault type='text' placeholder='0' value={amount} onChange={onChangeAmount} />
            </ModalInput>
          </ModalInputWrap>

          {tokenData.symbol && tokenData.symbol === CHAIN_CONFIG.PARAMS.SYMBOL && (
            <ModalToggleWrapper>
              <ToggleButton toggleText='Safety' isActive={isSafety} onClickToggle={onClickToggle} />
              {isSafety && (
                <ModalTooltipWrapper>
                  <ModalTooltipIcon />
                  <ModalTooltipTypo>
                    The entire amount is automatically entered except 0.1{CHAIN_CONFIG.PARAMS.SYMBOL}, which will be
                    used as a transaction fee.
                  </ModalTooltipTypo>
                </ModalTooltipWrapper>
              )}
            </ModalToggleWrapper>
          )}

          {isMobileApp === false && (
            <ModalInputWrap>
              <ModalLabel>Memo (optional)</ModalLabel>
              <ModalInput>
                <InputBoxDefault type='text' placeholder='' value={memo} onChange={onChangeMemo} />
              </ModalInput>
            </ModalInputWrap>
          )}

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

export default React.memo(SendModal);
