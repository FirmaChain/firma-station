import React from 'react';
import { useSelector } from 'react-redux';

import useFirma from '../../utils/wallet';
import { rootState } from '../../redux/reducers';
import { Modal } from '../../components/modal';
import { modalActions } from '../../redux/action';

import {
  disconnectModalWidth,
  ButtonWrapper,
  CancelButton,
  ModalContainer,
  ModalContent,
  NextButton,
  DisconnectIconWrap,
  DisconnectIcon,
  DisconnectTitle,
  DisconnectDescription,
} from './styles';

const DisconnectModal = () => {
  const disconnectModalState = useSelector((state: rootState) => state.modal.disconnect);
  const { resetWallet } = useFirma();

  const closeModal = () => {
    modalActions.handleModalDisconnect(false);
  };

  const disconnectWallet = () => {
    resetWallet();
    closeModal();
  };

  return (
    <Modal
      visible={disconnectModalState}
      closable={true}
      visibleClose={false}
      onClose={closeModal}
      width={disconnectModalWidth}
    >
      <ModalContainer>
        <ModalContent>
          <DisconnectIconWrap>
            <DisconnectIcon />
          </DisconnectIconWrap>
          <DisconnectTitle>Disconnect your wallet</DisconnectTitle>
          <DisconnectDescription>
            {'Are you sure you want to disconnect your wallet?\nDisconnecting is done safely.'}
          </DisconnectDescription>
          <ButtonWrapper>
            <CancelButton onClick={() => closeModal()} status={1}>
              Cancel
            </CancelButton>
            <NextButton onClick={() => disconnectWallet()} status={0}>
              Disconnect
            </NextButton>
          </ButtonWrapper>
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
};

export default React.memo(DisconnectModal);
