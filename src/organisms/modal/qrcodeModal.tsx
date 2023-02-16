import React from 'react';
import { useSelector } from 'react-redux';
import { QRCode } from 'react-qrcode-logo';

import { rootState } from '../../redux/reducers';
import { Modal } from '../../components/modal';
import { modalActions } from '../../redux/action';

import {
  qrCodeModalWidth,
  ModalContainer,
  ModalTitle,
  QRContent,
  QRCodeWrap,
  AddressTypo,
  ButtonWrapper,
  CancelButton,
} from './styles';
import theme from '../../themes';

const QRCodeModal = () => {
  const qrCodeModalState = useSelector((state: rootState) => state.modal.qrcode);
  const { address } = useSelector((state: rootState) => state.wallet);

  const closeQRCodeModal = () => {
    modalActions.handleModalQRCode(false);
  };

  return (
    <Modal
      visible={qrCodeModalState}
      closable={true}
      visibleClose={false}
      onClose={closeQRCodeModal}
      width={qrCodeModalWidth}
    >
      <ModalContainer>
        <ModalTitle>Your Wallet Address</ModalTitle>
        <QRContent>
          <QRCodeWrap>
            <QRCode value={address} quietZone={0} logoImage={theme.urls.qrIcon} logoWidth={40} logoHeight={40}></QRCode>
          </QRCodeWrap>
          <AddressTypo>{address}</AddressTypo>
        </QRContent>

        <ButtonWrapper>
          <CancelButton onClick={() => closeQRCodeModal()} status={1}>
            Close
          </CancelButton>
        </ButtonWrapper>
      </ModalContainer>
    </Modal>
  );
};

export default React.memo(QRCodeModal);
