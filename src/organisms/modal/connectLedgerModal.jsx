import React from "react";
import { useSelector } from "react-redux";

import { Modal } from "components/modal";
import { modalActions } from "redux/action";

import {
  connectLedgerModalWidth,
  ModalContainer,
  ModalTitle,
  ModalContent,
  ModalLabel,
  ModalInput,
  NextButton,
} from "./styles";

const ConnectLedgerModal = () => {
  const connectLedgerModalState = useSelector((state) => state.modal.connectLedger);

  const closeConnectLedgerModal = () => {
    closeModal();
  };

  const prevModal = () => {
    closeModal();
    modalActions.handleModalLogin(true);
  };

  const closeModal = () => {
    modalActions.handleModalConnectLedger(false);
  };

  return (
    <Modal
      visible={connectLedgerModalState}
      closable={true}
      onClose={closeModal}
      prev={prevModal}
      width={connectLedgerModalWidth}
    >
      <ModalContainer>
        <ModalTitle>Connecting to Ledger</ModalTitle>
        <ModalContent>
          <ModalLabel></ModalLabel>
          <ModalInput></ModalInput>
          <NextButton onClick={() => closeConnectLedgerModal()}>Connect</NextButton>
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
};

export default ConnectLedgerModal;
