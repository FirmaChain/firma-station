import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import ScaleLoader from 'react-spinners/ScaleLoader';

import { rootState } from '../../redux/reducers';
import { Modal } from '../../components/modal';
import { modalActions } from '../../redux/action';

import {
  queueTxModalWidth,
  ModalContainer,
  ModalTitle,
  ModalContent,
  LoadingWrapper,
  QueueTypoWrapper,
  AfterTypo,
  QueueTypoOne,
  ModalTooltipWrapper,
  ModalTooltipIcon,
  ModalTooltipTypo,
} from './styles';

const QueueTxModal = () => {
  const queueTxModalState = useSelector((state: rootState) => state.modal.queueTx);
  const modalData = useSelector((state: rootState) => state.modal.data);

  const { enqueueSnackbar } = useSnackbar();
  const [depend, setDepend] = useState(false);

  useEffect(() => {
    if (queueTxModalState) {
      if (Object.keys(modalData).length > 0) {
        const gas = modalData.data.gas ? modalData.data.gas : 0;
        modalData.txAction(resolveTx, rejectTx, gas);
      }
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
    enqueueSnackbar('Success Transaction', {
      variant: 'success',
      autoHideDuration: 1000,
    });
    closeQueueTxModal();
    setTimeout(() => window.location.reload(), 1000);
  };

  const rejectTx = () => {
    enqueueSnackbar('Failed Transaction', {
      variant: 'error',
      autoHideDuration: 1000,
    });
    closeQueueTxModal();
    setTimeout(() => window.location.reload(), 1000);
  };

  const closeQueueTxModal = () => {
    modalActions.handleModalQueueTx(false);
  };

  return (
    <Modal
      visible={queueTxModalState}
      closable={true}
      visibleClose={false}
      onClose={closeQueueTxModal}
      width={queueTxModalWidth}
    >
      <ModalContainer>
        <ModalTitle>Broadcasting Transaction</ModalTitle>
        <ModalContent>
          <LoadingWrapper>
            <ScaleLoader loading={true} color={'#3550DE80'} height={'50px'} width={'7px'} />
          </LoadingWrapper>
          <QueueTypoWrapper>
            <QueueTypoOne>It can take up from 5 to 15 seconds for a transaction to be completed.</QueueTypoOne>
            <AfterTypo isActive={depend}>
              <ModalTooltipWrapper>
                <ModalTooltipIcon />
                <ModalTooltipTypo>
                  Depending on the condition of the network, it can take up to more than 15 seconds.
                </ModalTooltipTypo>
              </ModalTooltipWrapper>
            </AfterTypo>
          </QueueTypoWrapper>
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
};

export default React.memo(QueueTxModal);
