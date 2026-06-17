import React from 'react';

import { Modal } from '../../components/modal';
import { GUIDE_LINK_CONNECT_TO_LEDGER } from '../../config';
import { modalActions, useModalStore } from '../../store';
import useFirma from '../../utils/wallet';
import { connectLedgerModalWidth, HelpIcon, ModalContainer, ModalContent, ModalTitle, NextButton } from './styles';

const ConnectLedgerModal = () => {
	const connectLedgerModalState = useModalStore((state) => state.connectLedger);
	const { connectLedger } = useFirma();

	const closeConnectLedgerModal = () => {
		closeModal();
	};

	const prevModal = () => {
		closeModal();
		modalActions.handleModalLogin(true);
	};

	const closeModal = () => {
		modalActions.handleModalConnectLedger(false);
	};

	const onClickConnectLedger = () => {
		connectLedger()
			.then((result) => {
				console.log(result);
				closeConnectLedgerModal();
			})
			.catch((error) => {
				console.log(error);
			});
	};

	return (
		<Modal visible={connectLedgerModalState} closable={true} onClose={closeModal} prev={prevModal} width={connectLedgerModalWidth}>
			<ModalContainer>
				<ModalTitle>
					Connect to Ledger
					<HelpIcon onClick={() => window.open(GUIDE_LINK_CONNECT_TO_LEDGER)} />
				</ModalTitle>
				<ModalContent>
					<NextButton $status={0} onClick={() => onClickConnectLedger()}>
						Connect
					</NextButton>
				</ModalContent>
			</ModalContainer>
		</Modal>
	);
};

export default React.memo(ConnectLedgerModal);
