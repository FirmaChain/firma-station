import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import ScaleLoader from "react-spinners/ScaleLoader";

import { Modal } from "components/modal";
import { modalActions } from "redux/action";

import { ModalContainer, ModalTitle, ModalContent } from "./styles";

import styled from "styled-components";

const LoadingWrapper = styled.div`
  width: 100%;
  margin: 20px 0;
  display: flex;
  justify-content: center;
`;

const QueueTxModal = () => {
  const queueTxModalState = useSelector((state) => state.modal.queueTx);

  useEffect(() => {
    if (queueTxModalState) {
      setTimeout(() => {
        closeQueueTxModal();
      }, 2000);
    }
  }, [queueTxModalState]);

  const closeQueueTxModal = () => {
    modalActions.handleModalQueueTx(false);
  };

  return (
    <Modal visible={queueTxModalState} closable={true} maskClosable={true} onClose={closeQueueTxModal} width={"500px"}>
      <ModalContainer>
        <ModalTitle>Broadcasting Transaction</ModalTitle>
        <ModalContent>
          <LoadingWrapper>
            <ScaleLoader loading={true} radius="4" color={"#3550DE80"} height={"50px"} width={"7px"} />
          </LoadingWrapper>
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
};

export default QueueTxModal;
