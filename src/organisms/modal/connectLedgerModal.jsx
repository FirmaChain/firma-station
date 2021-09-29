import React from "react";
import { useSelector } from "react-redux";

import { Modal } from "components/modal";
import { modalActions } from "redux/action";

import { ModalContainer, ModalTitle, ModalContent, ModalLabel, ModalInput, NextButton } from "./styles";

function ConnectLedgerModal() {
  const connectLedgerModalState = useSelector((state) => state.modal.connectLedgerModal);

  const closeConnectLedgerModal = () => {
    modalActions.handleConnectLedgerModal(false);
  };

  const prevModal = () => {
    closeConnectLedgerModal();
    modalActions.handleLoginModal(true);
  };

  return (
    <Modal
      visible={connectLedgerModalState}
      closable={true}
      maskClosable={true}
      onClose={closeConnectLedgerModal}
      prev={prevModal}
      width={"600px"}
    >
      <ModalContainer>
        <ModalTitle>Connecting to Ledger</ModalTitle>
        <ModalContent>
          <ModalLabel>USB</ModalLabel>
          <ModalInput></ModalInput>
          <NextButton onClick={() => closeConnectLedgerModal()}>Connect</NextButton>
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
}

export default ConnectLedgerModal;
