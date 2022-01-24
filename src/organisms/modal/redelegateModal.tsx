import React, { useState, useRef } from "react";
import numeral from "numeral";
import Select from "react-select";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";

import useFirma from "../../utils/wallet";
import { useApolloClient } from "@apollo/client";
import { rootState } from "../../redux/reducers";
import { convertNumber, convertToFctNumber, convertToFctString, isValid } from "../../utils/common";
import { Modal } from "../../components/modal";
import { modalActions } from "../../redux/action";
import { FIRMACHAIN_CONFIG } from "../../config";

import {
  redelegateModalWidth,
  ModalContainer,
  ModalTitle,
  ModalContent,
  ModalLabel,
  ModalInput,
  NextButton,
  InputBoxDefault,
} from "./styles";

import styled from "styled-components";

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
    color: "#3550DE",
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

const RedelegateModal = () => {
  const redelegateModalState = useSelector((state: rootState) => state.modal.redelegate);
  const modalData = useSelector((state: rootState) => state.modal.data);
  const { enqueueSnackbar } = useSnackbar();
  const { balance } = useSelector((state: rootState) => state.user);

  const { redelegate } = useFirma();
  const { reFetchObservableQueries } = useApolloClient();

  const [amount, setAmount] = useState("");
  const [isActiveButton, setActiveButton] = useState(false);
  const [sourceValidator, setSourceValidator] = useState("");
  const [sourceAmount, setSourceAmount] = useState(0);

  const selectInputRef = useRef<any>();

  const closeModal = () => {
    resetModal();
    modalActions.handleModalRedelegate(false);
  };

  const resetModal = () => {
    selectInputRef.current.clearValue();
    setActiveButton(false);
    setAmount("");
    setSourceValidator("");
    setSourceAmount(0);
  };

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
    setActiveButton(convertNumber(amount) > 0 && convertNumber(amount) <= sourceAmount);
  };

  const getMaxAmount = () => {
    return sourceAmount;
  };

  const redelegateTx = (resolveTx: () => void, rejectTx: () => void) => {
    redelegate(sourceValidator, modalData.data.targetValidator, convertNumber(amount))
      .then(() => {
        reFetchObservableQueries();
        resolveTx();
      })
      .catch(() => {
        rejectTx();
      });
  };

  const onChangeValidator = (e: any) => {
    if (e == null) return;
    const { value, amount } = e;

    setAmount("");
    setSourceValidator(value);
    setSourceAmount(convertToFctNumber(amount));
  };

  const nextStep = () => {
    if (convertNumber(balance) > convertToFctNumber(FIRMACHAIN_CONFIG.defaultFee * 1.5)) {
      modalActions.handleModalData({
        action: "Redelegate",
        data: { amount, fees: FIRMACHAIN_CONFIG.defaultFee * 1.5 },
        prevModalAction: modalActions.handleModalRedelegate,
        txAction: redelegateTx,
      });

      closeModal();
      modalActions.handleModalConfirmTx(true);
    } else {
      enqueueSnackbar("Insufficient funds. Please check your account balance.", {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
  };

  return (
    <Modal visible={redelegateModalState} closable={true} onClose={closeModal} width={redelegateModalWidth}>
      <ModalContainer>
        <ModalTitle>REDELEGATE</ModalTitle>
        <ModalContent>
          {isValid(modalData.data) && (
            <>
              <ModalLabel>Source Validator</ModalLabel>
              <SelectWrapper>
                <Select
                  options={modalData.data.delegationList.filter((v: any) => v.value !== modalData.data.targetValidator)}
                  styles={customStyles}
                  onChange={onChangeValidator}
                  ref={selectInputRef}
                />
              </SelectWrapper>
            </>
          )}
          {sourceValidator && (
            <>
              <ModalLabel>Available</ModalLabel>
              <ModalInput>{numeral(sourceAmount).format("0,0.000")} FCT</ModalInput>

              <ModalLabel>Fees</ModalLabel>
              <ModalInput>{`${convertToFctString((FIRMACHAIN_CONFIG.defaultFee * 1.5).toString())} FCT`}</ModalInput>

              <ModalLabel>Amount</ModalLabel>
              <ModalInput>
                <InputBoxDefault type="text" placeholder="0" onChange={onChangeAmount} value={amount} />
              </ModalInput>
            </>
          )}

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

export default React.memo(RedelegateModal);
