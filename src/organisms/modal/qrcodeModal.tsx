import React from 'react';
import { QRCode } from 'react-qrcode-logo';

import { Modal } from '../../components/modal';
import { modalActions, useModalStore, useWalletStore } from '../../store';
import theme from '../../themes';
import { AddressTypo, ButtonWrapper, CancelButton, ModalContainer, ModalTitle, qrCodeModalWidth, QRCodeWrap, QRContent } from './styles';

const QRCodeModal = () => {
	const qrCodeModalState = useModalStore((state) => state.qrcode);
	const { address } = useWalletStore((state) => state);

	const closeQRCodeModal = () => {
		modalActions.handleModalQRCode(false);
	};

	return (
		<Modal visible={qrCodeModalState} closable={true} visibleClose={false} onClose={closeQRCodeModal} width={qrCodeModalWidth}>
			<ModalContainer>
				<ModalTitle>Your Wallet Address</ModalTitle>
				<QRContent>
					<QRCodeWrap>
						<QRCode value={address} quietZone={0} logoImage={theme.urls.qrIcon} logoWidth={40} logoHeight={40}></QRCode>
					</QRCodeWrap>
					<AddressTypo>{address}</AddressTypo>
				</QRContent>

				<ButtonWrapper>
					<CancelButton onClick={() => closeQRCodeModal()} $status={1}>
						Close
					</CancelButton>
				</ButtonWrapper>
			</ModalContainer>
		</Modal>
	);
};

export default React.memo(QRCodeModal);
