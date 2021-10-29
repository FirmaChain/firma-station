import React from "react";
import { useSelector } from "react-redux";

import { rootState } from "../../redux/reducers";
import { Modal } from "../../components/modal";
import { modalActions } from "../../redux/action";

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
  const connectLedgerModalState = useSelector((state: rootState) => state.modal.connectLedger);

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
          <NextButton active={true} onClick={() => closeConnectLedgerModal()}>
            Connect
          </NextButton>
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
};

export default React.memo(ConnectLedgerModal);
