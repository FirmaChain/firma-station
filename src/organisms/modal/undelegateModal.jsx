import React, { useState } from "react";
import { useSelector } from "react-redux";

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

const UndelegateModal = () => {
  const undelegateModalState = useSelector((state) => state.modal.undelegate);
  const [amount, setAmount] = useState("");
  const [isActiveButton, setActiveButton] = useState(false);

  const available = 993;

  const closeModal = () => {
    resetModal();
    modalActions.handleModalUndelegate(false);
  };

  const resetModal = () => {
    setAmount("");
  };

  const onChangeAmount = (e) => {
    const { value } = e.target;
    const amount = value.replace(/[^0-9.]/g, "");

    setAmount(amount);
    setActiveButton(amount > 0 && amount <= available);
  };

  const nextStep = () => {
    modalActions.handleModalData({
      action: "Undelegate",
      data: { amount: amount },
      prevModalAction: modalActions.handleModalUndelegate,
    });

    closeModal();
    modalActions.handleModalConfirmTx(true);
  };

  return (
    <Modal visible={undelegateModalState} closable={true} maskClosable={true} onClose={closeModal} width={"500px"}>
      <ModalContainer>
        <ModalTitle>Undelegate</ModalTitle>
        <ModalContent>
          <ModalLabel>Available</ModalLabel>
          <ModalInput>{available} FCT</ModalInput>

          <ModalLabel>Amount</ModalLabel>
          <ModalInput>
            <InputBoxDefault type="text" placeholder="0" value={amount} onChange={onChangeAmount} />
          </ModalInput>
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

export default UndelegateModal;
