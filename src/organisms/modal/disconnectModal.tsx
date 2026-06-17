import React from 'react';

import { Modal } from '../../components/modal';
import { modalActions, useModalStore } from '../../store';
import useFirma from '../../utils/wallet';
import {
	ButtonWrapper,
	CancelButton,
	DisconnectDescription,
	DisconnectIcon,
	DisconnectIconWrap,
	disconnectModalWidth,
	DisconnectTitle,
	ModalContainer,
	ModalContent,
	NextButton
} from './styles';

const DisconnectModal = () => {
	const disconnectModalState = useModalStore((state) => state.disconnect);
	const { resetWallet } = useFirma();

	const closeModal = () => {
		modalActions.handleModalDisconnect(false);
	};

	const disconnectWallet = () => {
		resetWallet();
		closeModal();
	};

	return (
		<Modal visible={disconnectModalState} closable={true} visibleClose={false} onClose={closeModal} width={disconnectModalWidth}>
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
						<CancelButton onClick={() => closeModal()} $status={1}>
							Cancel
						</CancelButton>
						<NextButton onClick={() => disconnectWallet()} $status={0}>
							Disconnect
						</NextButton>
					</ButtonWrapper>
				</ModalContent>
			</ModalContainer>
		</Modal>
	);
};

export default React.memo(DisconnectModal);
