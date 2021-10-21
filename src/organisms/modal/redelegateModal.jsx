import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import Select from "react-select";
import numeral from "numeral";

import { Modal } from "components/modal";
import { modalActions } from "redux/action";

import useFirma from "utils/wallet";
import { isValid } from "utils/common";

import {
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
  control: (provided) => ({
    ...provided,
    backgroundColor: "#1B1C22",
    border: "1px solid #324ab8aa",
  }),
  option: (provided, state) => ({
    ...provided,
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "white",
  }),
  indicatorSeparator: (provided) => ({
    ...provided,
    color: "#324ab8aa",
    backgroundColor: "#324ab8aa",
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    color: "#324ab8aa",
  }),
};

const RedelegateModal = () => {
  const redelegateModalState = useSelector((state) => state.modal.redelegate);
  const modalData = useSelector((state) => state.modal.data);

  const { redelegate } = useFirma();

  const [amount, setAmount] = useState("");
  const [isActiveButton, setActiveButton] = useState(false);
  const [sourceValidator, setSourceValidator] = useState(null);
  const [sourceAmount, setSourceAmount] = useState(null);

  const selectInputRef = useRef();

  const closeModal = () => {
    resetModal();
    modalActions.handleModalRedelegate(false);
  };

  const resetModal = () => {
    selectInputRef.current.clearValue();
    setActiveButton(false);
    setAmount("");
    setSourceValidator(null);
    setSourceAmount(0);
  };

  const onChangeAmount = (e) => {
    const { value } = e.target;
    const amount = value.replace(/[^0-9.]/g, "");

    setAmount(amount);
    setActiveButton(amount > 0 && amount <= sourceAmount);
  };

  const redelegateTx = (resolveTx, rejectTx) => {
    redelegate(sourceValidator, modalData.data.targetValidator, amount)
      .then(() => {
        resolveTx();
      })
      .catch(() => {
        rejectTx();
      });
  };

  const onChangeValidator = (e) => {
    if (e == null) return;
    const { value, amount } = e;

    setAmount("");
    setSourceValidator(value);
    setSourceAmount(numeral(amount / 1000000).value());
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
    <Modal visible={redelegateModalState} closable={true} onClose={closeModal} width={"500px"}>
      <ModalContainer>
        <ModalTitle>Redelegate</ModalTitle>
        <ModalContent>
          {isValid(modalData.data) && (
            <>
              <ModalLabel>Source Validator</ModalLabel>
              <SelectWrapper>
                <Select
                  options={modalData.data.delegationList.filter((v) => v.value !== modalData.data.targetValidator)}
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

export default RedelegateModal;
