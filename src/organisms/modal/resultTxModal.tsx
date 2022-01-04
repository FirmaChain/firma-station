import React from "react";
import { useSelector } from "react-redux";

import { rootState } from "../../redux/reducers";
import { Modal } from "../../components/modal";
import { modalActions } from "../../redux/action";

import { resultTxModalWidth, ModalContainer, ModalTitle, ModalContent } from "./styles";

const ResultTxModal = () => {
  const resultTxModalState = useSelector((state: rootState) => state.modal.resultTx);

  const closeResultTxModal = () => {
    modalActions.handleModalResultTx(false);
  };

  return (
    <Modal visible={resultTxModalState} closable={true} onClose={closeResultTxModal} width={resultTxModalWidth}>
      <ModalContainer>
        <ModalTitle>RESULT</ModalTitle>
        <ModalContent>Success</ModalContent>
      </ModalContainer>
    </Modal>
  );
};

export default React.memo(ResultTxModal);
