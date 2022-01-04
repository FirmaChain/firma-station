import React from "react";
import { useSelector } from "react-redux";
import QRCode from "qrcode.react";

import { rootState } from "../../redux/reducers";
import { Modal } from "../../components/modal";
import { modalActions } from "../../redux/action";

import { qrCodeModalWidth, ModalContainer, ModalTitle, QRContent, QRCodeWrap, AddressTypo } from "./styles";

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
      maskClosable={true}
      onClose={closeQRCodeModal}
      width={qrCodeModalWidth}
    >
      <ModalContainer>
        <ModalTitle>YOUR WALLET ADDRESS</ModalTitle>
        <QRContent>
          <QRCodeWrap>
            <QRCode value={address}></QRCode>
          </QRCodeWrap>
          <AddressTypo>{address}</AddressTypo>
        </QRContent>
      </ModalContainer>
    </Modal>
  );
};

export default React.memo(QRCodeModal);
