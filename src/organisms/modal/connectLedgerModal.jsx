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
    modalActions.handleModalConnectLedger(false);
  };

  const prevModal = () => {
    closeConnectLedgerModal();
    modalActions.handleModalLogin(true);
  };

  return (
    <Modal
      visible={connectLedgerModalState}
      closable={true}
      maskClosable={true}
      onClose={closeConnectLedgerModal}
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
