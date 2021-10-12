import React from "react";
import { useSelector } from "react-redux";

import { Modal } from "components/modal";
import { modalActions } from "redux/action";

import { ModalContainer, ModalTitle, ModalContent } from "./styles";

const DelegateModal = () => {
  const delegateModalState = useSelector((state) => state.modal.delegate);

  const closeDelegateModal = () => {
    modalActions.handleModalDelegate(false);
  };

  return (
    <Modal
      visible={delegateModalState}
      closable={true}
      maskClosable={true}
      onClose={closeDelegateModal}
      width={"500px"}
    >
      <ModalContainer>
        <ModalTitle>Delegate</ModalTitle>
        <ModalContent></ModalContent>
      </ModalContainer>
    </Modal>
  );
};

export default DelegateModal;
