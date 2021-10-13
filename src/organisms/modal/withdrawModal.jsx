import React from "react";
import { useSelector } from "react-redux";

import { Modal } from "components/modal";
import { modalActions } from "redux/action";

import { ModalContainer, ModalTitle, ModalContent } from "./styles";

const WithdrawModal = () => {
  const withdrawModalState = useSelector((state) => state.modal.withdraw);

  const closeWithdrawModal = () => {
    modalActions.handleModalWithdraw(false);
  };

  return (
    <Modal
      visible={withdrawModalState}
      closable={true}
      maskClosable={true}
      onClose={closeWithdrawModal}
      width={"500px"}
    >
      <ModalContainer>
        <ModalTitle>Withdraw</ModalTitle>
        <ModalContent></ModalContent>
      </ModalContainer>
    </Modal>
  );
};

export default WithdrawModal;
