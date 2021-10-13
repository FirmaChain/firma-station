import React from "react";
import { useSelector } from "react-redux";

import { Modal } from "components/modal";
import { modalActions } from "redux/action";

import {
  ModalContainer,
  ModalTitle,
  ModalContent,
  ConfirmWrapper,
  ConfirmLabel,
  ConfirmInput,
  NextButton,
} from "./styles";

const ConfirmTxModal = () => {
  const confirmTxModalState = useSelector((state) => state.modal.confirmTx);
  const { action, prevModalAction, data } = useSelector((state) => state.modal.data);

  const closeConfirmTxModal = () => {
    modalActions.handleModalConfirmTx(false);
  };

  const prevModal = () => {
    closeConfirmTxModal();
    prevModalAction(true);
  };

  const queueTx = () => {
    closeConfirmTxModal();
    modalActions.handleModalQueueTx(true);
  };

  return (
    <Modal
      visible={confirmTxModalState}
      closable={true}
      maskClosable={true}
      onClose={closeConfirmTxModal}
      prev={prevModal}
      width={"400px"}
    >
      <ModalContainer>
        <ModalTitle>Confirm</ModalTitle>
        <ModalContent>
          <ConfirmWrapper>
            <ConfirmLabel>Amount</ConfirmLabel>
            <ConfirmInput>{Number(data.amount).toFixed(6)} FCT</ConfirmInput>
          </ConfirmWrapper>
          <ConfirmWrapper>
            <ConfirmLabel>Fee</ConfirmLabel>
            <ConfirmInput>0.002000 FCT</ConfirmInput>
          </ConfirmWrapper>
          <NextButton
            style={{ marginTop: "50px" }}
            onClick={() => {
              queueTx();
            }}
            active={true}
          >
            {action}
          </NextButton>
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
};

export default ConfirmTxModal;
