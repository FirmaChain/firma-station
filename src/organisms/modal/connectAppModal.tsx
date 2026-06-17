import React from 'react';
import { useSnackbar } from 'notistack';

import { Modal } from '../../components/modal';
import { GUIDE_LINK_CONNECT_TO_LEDGER } from '../../config';
import RequestQR from '../../organisms/requestQR';
import { modalActions, useModalStore } from '../../store';
import useFirma from '../../utils/wallet';
import {
	connectLedgerModalWidth,
	GuideContainer,
	GuideIcon,
	GuideStep,
	GuideText,
	HelpIcon,
	ModalContainer,
	ModalContent,
	ModalSubTitle,
	ModalTitle,
	QRContainer,
	StepDivider
} from './styles';

const ConnectAppModal = () => {
	const connectAppModalState = useModalStore((state) => state.connectApp);
	const { enqueueSnackbar } = useSnackbar();
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
		<Modal visible={connectAppModalState} closable={true} onClose={closeModal} prev={prevModal} width={connectLedgerModalWidth}>
			<ModalContainer>
				<ModalTitle style={{ marginBottom: '10px' }}>
					Connect to Mobile
					<HelpIcon onClick={() => window.open(GUIDE_LINK_CONNECT_TO_LEDGER)} />
				</ModalTitle>
				<ModalContent>
					<ModalSubTitle>Securely connect your wallet with the firmastation app.</ModalSubTitle>
					<QRContainer>
						<RequestQR
							module="/login"
							onSuccess={(requestData: any) => {
								connectWalletApp(requestData.signer);
								closeConnectAppModal();
								enqueueSnackbar('Successfully connected to wallet.', {
									variant: 'success',
									autoHideDuration: 2000
								});
							}}
							onFailed={() => {
								closeConnectAppModal();
								enqueueSnackbar('failed connect to wallet.', {
									variant: 'error',
									autoHideDuration: 2000
								});
							}}
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
