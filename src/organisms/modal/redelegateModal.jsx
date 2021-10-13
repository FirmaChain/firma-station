import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import Select from "react-select";

import { Modal } from "components/modal";
import { modalActions } from "redux/action";

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

const options = [
  { value: "chocolate", label: "firma-node-1" },
  { value: "strawberry", label: "firma-node-2" },
  { value: "vanilla", label: "firma-node-3" },
];

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
  const [amount, setAmount] = useState("");
  const [isActiveButton, setActiveButton] = useState(false);
  const [sourceValidator, setSourceValidator] = useState(null);

  const selectInputRef = useRef();
  const available = 993;

  const closeModal = () => {
    resetModal();
    modalActions.handleModalRedelegate(false);
  };

  const resetModal = () => {
    selectInputRef.current.clearValue();
    setActiveButton(false);
    setAmount("");
    setSourceValidator(null);
  };

  const onChangeAmount = (e) => {
    const { value } = e.target;
    const amount = value.replace(/[^0-9.]/g, "");

    setAmount(amount);
    setActiveButton(amount > 0 && amount <= available);
  };

  const onChangeValidator = (e) => {
    if (e == null) return;
    const { value } = e;

    setAmount("");
    setSourceValidator(value);
  };

  const nextStep = () => {
    modalActions.handleModalData({
      action: "Redelegate",
      data: { amount },
      prevModalAction: modalActions.handleModalRedelegate,
    });

    closeModal();
    modalActions.handleModalConfirmTx(true);
  };

  return (
    <Modal visible={redelegateModalState} closable={true} maskClosable={true} onClose={closeModal} width={"500px"}>
      <ModalContainer>
        <ModalTitle>Redelegate</ModalTitle>
        <ModalContent>
          <ModalLabel>Source Validator</ModalLabel>
          <SelectWrapper>
            <Select options={options} styles={customStyles} onChange={onChangeValidator} ref={selectInputRef} />
          </SelectWrapper>
          {sourceValidator && (
            <>
              <ModalLabel>Available</ModalLabel>
              <ModalInput>{available} FCT</ModalInput>

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
