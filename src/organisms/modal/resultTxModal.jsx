import React from "react";
import { useSelector } from "react-redux";

import { Modal } from "components/modal";
import { modalActions } from "redux/action";

import { ModalContainer, ModalTitle, ModalContent } from "./styles";

const ResultTxModal = () => {
  const resultTxModalState = useSelector((state) => state.modal.resultTx);

  const closeResultTxModal = () => {
    modalActions.handleModalResultTx(false);
  };

  return (
    <Modal
      visible={resultTxModalState}
      closable={true}
      maskClosable={true}
      onClose={closeResultTxModal}
      width={"500px"}
    >
      <ModalContainer>
        <ModalTitle>Result</ModalTitle>
        <ModalContent>Success</ModalContent>
      </ModalContainer>
    </Modal>
  );
};

export default ResultTxModal;
