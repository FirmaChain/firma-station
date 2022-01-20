import React, { useEffect, useState, useRef } from "react";
import Select from "react-select";
import { useSelector } from "react-redux";

import useFirma from "../../utils/wallet";
import { useApolloClient } from "@apollo/client";
import { rootState } from "../../redux/reducers";
import { Modal } from "../../components/modal";
import { modalActions } from "../../redux/action";

import {
  sendModalWidth,
  ModalContainer,
  ModalTitle,
  ModalContent,
  ModalLabel,
  ModalInput,
  NextButton,
  InputBoxDefault,
} from "./styles";
import { convertNumber, convertToFctNumber, convertToFctString } from "../../utils/common";

import styled from "styled-components";
import { FIRMACHAIN_CONFIG } from "../../config";

const SelectWrapper = styled.div`
  width: 100%;
  margin-bottom: 30px;
`;

const customStyles = {
  control: (provided: any) => ({
    ...provided,
    backgroundColor: "#21212f",
    border: "1px solid #696974",
  }),
  option: (provided: any) => ({
    ...provided,
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: "white",
  }),
  indicatorSeparator: (provided: any) => ({
    ...provided,
    color: "#324ab8aa",
    backgroundColor: "#324ab8aa",
  }),
  dropdownIndicator: (provided: any) => ({
    ...provided,
    color: "#324ab8aa",
  }),
};

const SendModal = () => {
  const sendModalState = useSelector((state: rootState) => state.modal.send);
  const { balance, tokenList } = useSelector((state: rootState) => state.user);
  const { sendFCT, sendToken, isValidAddress } = useFirma();
  const { reFetchObservableQueries } = useApolloClient();

  const [available, setAvailable] = useState(0);
  const [tokenData, setTokenData] = useState({
    symbol: "FCT",
    denom: "ufct",
    decimal: 6,
  });
  const [amount, setAmount] = useState("");
  const [targetAddress, setTargetAddress] = useState("");
  const [memo, setMemo] = useState("");
  const [isActiveButton, setActiveButton] = useState(false);

  const selectInputRef = useRef<any>();

  const closeModal = () => {
    resetModal();
    modalActions.handleModalSend(false);
  };

  const resetModal = () => {
    setAmount("");
  };

  useEffect(() => {
    checkParams();
  }, [amount, targetAddress, memo]); // eslint-disable-line react-hooks/exhaustive-deps

  const onChangeAmount = (e: any) => {
    const { value } = e.target;

    let amount: string = value.replace(/[^0-9.]/g, "");

    if (amount === "") {
      setAmount("");
      return;
    }

    const pattern = /(^\d+$)|(^\d{1,}.\d{0,6}$)/;

    if (!pattern.test(amount)) {
      amount = convertNumber(amount).toFixed(6);
    }

    if (convertNumber(amount) > getMaxAmount()) {
      amount = getMaxAmount().toString();
    }

    setAmount(amount);
  };

  const onChangeTargetAddress = (e: any) => {
    const { value } = e.target;
    const address = value.replace(/ /g, "");

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
  };

  const checkParams = () => {
    setActiveButton(
      targetAddress !== "" &&
        isValidAddress(targetAddress) &&
        amount !== "" &&
        convertNumber(amount) <= convertNumber(available) &&
        convertNumber(amount) > 0
    );
  };

  const getMaxAmount = (): Number => {
    if (tokenData.symbol === "FCT") {
      return convertNumber((available - convertToFctNumber(FIRMACHAIN_CONFIG.defaultFee)).toFixed(6));
    } else {
      return available;
    }
  };

  const sendTx = (resolveTx: () => void, rejectTx: () => void) => {
    if (tokenData.symbol === "FCT") {
      sendFCT(targetAddress, amount, memo)
        .then(() => {
          reFetchObservableQueries();
          resolveTx();
        })
        .catch(() => {
          rejectTx();
        });
    } else {
      sendToken(targetAddress, amount, tokenData.denom, tokenData.decimal, memo)
        .then(() => {
          reFetchObservableQueries();
          resolveTx();
        })
        .catch(() => {
          rejectTx();
        });
    }
  };

  const nextStep = () => {
    modalActions.handleModalData({
      action: "Send",
      data: { amount },
      prevModalAction: modalActions.handleModalSend,
      txAction: sendTx,
    });

    closeModal();
    modalActions.handleModalConfirmTx(true);
  };

  return (
    <Modal visible={sendModalState} closable={true} onClose={closeModal} width={sendModalWidth}>
      <ModalContainer>
        <ModalTitle>SEND</ModalTitle>
        <ModalContent>
          <ModalLabel>Symbol</ModalLabel>
          <SelectWrapper>
            <Select
              options={[
                { value: "FCT", label: "FCT", balance: balance },
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
              type="text"
              placeholder="Wallet Address"
              value={targetAddress}
              onChange={onChangeTargetAddress}
            />
          </ModalInput>

          <ModalLabel>Available</ModalLabel>
          <ModalInput>
            {available} {tokenData.symbol}
          </ModalInput>

          <ModalLabel>Fees</ModalLabel>
          <ModalInput>{`${convertToFctString(FIRMACHAIN_CONFIG.defaultFee.toString())} FCT`}</ModalInput>

          <ModalLabel>Amount</ModalLabel>
          <ModalInput>
            <InputBoxDefault type="text" placeholder="0" value={amount} onChange={onChangeAmount} />
          </ModalInput>

          <ModalLabel>Memo (optional)</ModalLabel>
          <ModalInput>
            <InputBoxDefault type="text" placeholder="" value={memo} onChange={onChangeMemo} />
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
