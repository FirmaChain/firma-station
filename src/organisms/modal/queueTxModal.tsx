import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import ScaleLoader from "react-spinners/ScaleLoader";

import { rootState } from "../../redux/reducers";
import { Modal } from "../../components/modal";
import { modalActions } from "../../redux/action";

import {
  queueTxModalWidth,
  ModalContainer,
  ModalTitle,
  ModalContent,
  LoadingWrapper,
  QueueTypoWrapper,
  AfterTypo,
  QueueIcon,
  QueueTypoOne,
  QueueTypoTwo,
} from "./styles";

const QueueTxModal = () => {
  const queueTxModalState = useSelector((state: rootState) => state.modal.queueTx);
  const modalData = useSelector((state: rootState) => state.modal.data);

  const { enqueueSnackbar } = useSnackbar();
  const [depend, setDepend] = useState(false);

  useEffect(() => {
    if (queueTxModalState) {
      const gas = modalData.data.gas ? modalData.data.gas : 0;

      modalData.txAction(resolveTx, rejectTx, gas);
    }

    const timer = setTimeout(() => {
      setDepend(true);
      clearTimeout(timer);
    }, 15000);

    return () => {
      clearTimeout(timer);
    };
  }, [queueTxModalState]); // eslint-disable-line react-hooks/exhaustive-deps

  const resolveTx = () => {
    enqueueSnackbar("Success Transaction", {
      variant: "success",
      autoHideDuration: 2000,
    });
    closeQueueTxModal();
  };

  const rejectTx = () => {
    enqueueSnackbar("Failed Transaction", {
      variant: "error",
      autoHideDuration: 2000,
    });
    closeQueueTxModal();
  };

  const closeQueueTxModal = () => {
    modalActions.handleModalQueueTx(false);
  };

  return (
    <Modal visible={queueTxModalState} closable={true} onClose={closeQueueTxModal} width={queueTxModalWidth}>
      <ModalContainer>
        <ModalTitle>BROADCASTING TRANSACTION</ModalTitle>
        <ModalContent>
          <LoadingWrapper>
            <ScaleLoader loading={true} color={"#3550DE80"} height={"50px"} width={"7px"} />
          </LoadingWrapper>
          <QueueTypoWrapper>
            <QueueTypoOne>It can take up from 5 to 15 seconds for a transaction to be completed.</QueueTypoOne>
            <AfterTypo isActive={depend}>
              <QueueIcon />
              <QueueTypoTwo>
                Depending on the condition of the network, it can take up to more than 15 seconds.
              </QueueTypoTwo>
            </AfterTypo>
          </QueueTypoWrapper>
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
};

export default React.memo(QueueTxModal);
