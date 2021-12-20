import React from "react";
import { useSelector } from "react-redux";

import useFirma from "../../utils/wallet";
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
  const { connectLedger } = useFirma();

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

  const onClickConnectLedger = () => {
    connectLedger()
      .then((result) => {
        console.log(result);
        closeConnectLedgerModal();
      })
      .catch((e) => {
        console.log(e);
      });
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
        <ModalTitle>Connect to Ledger</ModalTitle>
        <ModalContent>
          <ModalLabel></ModalLabel>
          <ModalInput></ModalInput>
          <NextButton active={true} onClick={() => onClickConnectLedger()}>
            Connect
          </NextButton>
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
};

export default React.memo(ConnectLedgerModal);
