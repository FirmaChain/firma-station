import React, { useState, useRef } from "react";
import numeral from "numeral";
import Select from "react-select";
import { useSelector } from "react-redux";

import useFirma from "../../utils/wallet";
import { useApolloClient } from "@apollo/client";
import { rootState } from "../../redux/reducers";
import { convertNumber, convertToFctNumber, isValid } from "../../utils/common";
import { Modal } from "../../components/modal";
import { modalActions } from "../../redux/action";

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
    backgroundColor: "#1B1C22",
    border: "1px solid #324ab8aa",
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

const RedelegateModal = () => {
  const redelegateModalState = useSelector((state: rootState) => state.modal.redelegate);
  const modalData = useSelector((state: rootState) => state.modal.data);

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
    const amount = value.replace(/[^0-9.]/g, "");

    setAmount(amount);
    setActiveButton(amount > 0 && amount <= sourceAmount);
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
    modalActions.handleModalData({
      action: "Redelegate",
      data: { amount },
      prevModalAction: modalActions.handleModalRedelegate,
      txAction: redelegateTx,
    });

    closeModal();
    modalActions.handleModalConfirmTx(true);
  };

  return (
    <Modal visible={redelegateModalState} closable={true} onClose={closeModal} width={redelegateModalWidth}>
      <ModalContainer>
        <ModalTitle>Redelegate</ModalTitle>
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

              <ModalLabel>Amount</ModalLabel>
              <ModalInput>
                <InputBoxDefault type="text" placeholder="0" onChange={onChangeAmount} />
              </ModalInput>
            </>
          )}

          <NextButton
            onClick={() => {
              if (isActiveButton) nextStep();
            }}
            active={isActiveButton}
          >
            NEXT
          </NextButton>
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
};

export default React.memo(RedelegateModal);
