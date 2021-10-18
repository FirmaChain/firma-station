import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
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
  const modalData = useSelector((state) => state.modal.data);

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (queueTxModalState) {
      modalData.txAction(endTx);
    }
  }, [queueTxModalState]);

  const endTx = () => {
    closeQueueTxModal();
    enqueueSnackbar("Success Transaction", {
      variant: "success",
      autoHideDuration: 1000,
    });
  };

  const closeQueueTxModal = () => {
    modalActions.handleModalQueueTx(false);
  };

  return (
    <Modal visible={queueTxModalState} closable={true} maskClosable={true} onClose={closeQueueTxModal} width={"500px"}>
      <ModalContainer>
        <ModalTitle>Broadcasting Transaction</ModalTitle>
        <ModalContent>
          <LoadingWrapper>
            <ScaleLoader loading={true} color={"#3550DE80"} height={"50px"} width={"7px"} />
          </LoadingWrapper>
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
};

export default QueueTxModal;
