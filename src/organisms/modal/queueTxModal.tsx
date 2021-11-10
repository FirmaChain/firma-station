import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import ScaleLoader from "react-spinners/ScaleLoader";

import { rootState } from "../../redux/reducers";
import { Modal } from "../../components/modal";
import { modalActions } from "../../redux/action";

import { queueTxModalWidth, ModalContainer, ModalTitle, ModalContent, LoadingWrapper } from "./styles";

const QueueTxModal = () => {
  const queueTxModalState = useSelector((state: rootState) => state.modal.queueTx);
  const modalData = useSelector((state: rootState) => state.modal.data);

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (queueTxModalState) {
      modalData.txAction(resolveTx, rejectTx);
    }
  }, [queueTxModalState]); // eslint-disable-line react-hooks/exhaustive-deps

  const resolveTx = () => {
    enqueueSnackbar("Success Transaction", {
      variant: "success",
      autoHideDuration: 1000,
    });
    closeQueueTxModal();
  };

  const rejectTx = () => {
    enqueueSnackbar("Failed Transaction", {
      variant: "error",
      autoHideDuration: 1000,
    });
    closeQueueTxModal();
  };

  const closeQueueTxModal = () => {
    modalActions.handleModalQueueTx(false);
  };

  return (
    <Modal visible={queueTxModalState} closable={true} onClose={closeQueueTxModal} width={queueTxModalWidth}>
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

export default React.memo(QueueTxModal);
