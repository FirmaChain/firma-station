import React from 'react';
import { useSelector } from 'react-redux';

import useFirma from '../../utils/wallet';
import RequestQR from '../../organisms/requestQR';

import { Modal } from '../../components/modal';
import { rootState } from '../../redux/reducers';
import { modalActions } from '../../redux/action';

import { GUIDE_LINK_CONNECT_TO_LEDGER } from '../../config';

import {
  connectLedgerModalWidth,
  ModalContainer,
  ModalTitle,
  ModalContent,
  QRContainer,
  HelpIcon,
  ModalSubTitle,
  GuideContainer,
  GuideStep,
  GuideIcon,
  GuideText,
  StepDivider,
} from './styles';

const ConnectAppModal = () => {
  const connectAppModalState = useSelector((state: rootState) => state.modal.connectApp);
  const { connectWalletApp } = useFirma();

  const closeConnectAppModal = () => {
    closeModal();
  };

  const prevModal = () => {
    closeModal();
    modalActions.handleModalLogin(true);
  };

  const closeModal = () => {
    modalActions.handleModalConnectApp(false);
  };

  return (
    <Modal
      visible={connectAppModalState}
      closable={true}
      onClose={closeModal}
      prev={prevModal}
      width={connectLedgerModalWidth}
    >
      <ModalContainer>
        <ModalTitle style={{ marginBottom: '10px' }}>
          Connect to Mobile
          <HelpIcon onClick={() => window.open(GUIDE_LINK_CONNECT_TO_LEDGER)} />
        </ModalTitle>
        <ModalContent>
          <ModalSubTitle>Securely connect your wallet with the firmastation app.</ModalSubTitle>
          <QRContainer>
            <RequestQR
              module='/login'
              onSuccess={(requestData: any) => {
                connectWalletApp(requestData.signer);
                closeConnectAppModal();
              }}
              onFailed={() => {}}
            />
          </QRContainer>
          <GuideContainer>
            <GuideStep>
              <GuideIcon step={1} />
              <GuideText>{'1. Station app\nOpen'}</GuideText>
            </GuideStep>
            <StepDivider>〉</StepDivider>
            <GuideStep>
              <GuideIcon step={2} />
              <GuideText>{'2. Station app\nLogin'}</GuideText>
            </GuideStep>
            <StepDivider>〉</StepDivider>
            <GuideStep>
              <GuideIcon step={3} />
              <GuideText>{'3. Log in after\nscanning the QR'}</GuideText>
            </GuideStep>
          </GuideContainer>
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
};

export default React.memo(ConnectAppModal);
