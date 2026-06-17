import React, { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';

import { Modal } from '../../components/modal';
import { GUIDE_LINK_NEW_WALLET } from '../../config';
import { modalActions, useModalStore } from '../../store';
import { copyToClipboard, isValidString } from '../../utils/common';
import useFirma from '../../utils/wallet';
import Password from './password';
import {
	CopyIcon,
	HelpIcon,
	Mnemonic,
	MnemonicContainter,
	ModalContainer,
	ModalContent,
	ModalInput,
	ModalInputWrap,
	ModalLabel,
	ModalTitle,
	newWalletModalWidth,
	NextButton
} from './styles';

const NewWalletModal = () => {
	const newWalletModalState = useModalStore((state) => state.newWallet);
	const { enqueueSnackbar } = useSnackbar();
	const { getNewMnemonic } = useFirma();

	const [mnemonic, setMnemonic] = useState('');
	const [password, setPassword] = useState('');

	useEffect(() => {
		if (newWalletModalState) {
			getNewMnemonic().then((mnemonic) => {
				setMnemonic(mnemonic);
			});
		}
	}, [newWalletModalState]); // eslint-disable-line react-hooks/exhaustive-deps

	const closeNewWalletModal = () => {
		closeModal();
	};

	const openConfirmModal = () => {
		if (password !== '') {
			closeModal();
			modalActions.handleModalData({ mnemonic, password });
			modalActions.handleModalConfirmWallet(true);
		} else {
			enqueueSnackbar('Incorrect Password', {
				variant: 'error',
				autoHideDuration: 2000
			});
		}
	};

	const prevModal = () => {
		closeNewWalletModal();
		modalActions.handleModalLogin(true);
	};

	const closeModal = () => {
		modalActions.handleModalNewWallet(false);
	};

	const clipboard = (value: string) => {
		if (value === '') return;

		copyToClipboard(value);

		enqueueSnackbar('Copied', {
			variant: 'success',
			autoHideDuration: 1000
		});
	};

	const onChangePassword = (password: string) => {
		setPassword(password);
	};

	const onKeyDownPassword = () => {
		openConfirmModal();
	};

	return (
		<Modal visible={newWalletModalState} closable={true} onClose={closeNewWalletModal} prev={prevModal} width={newWalletModalWidth}>
			<ModalContainer>
				<ModalTitle>
					Create a Wallet
					<HelpIcon onClick={() => window.open(GUIDE_LINK_NEW_WALLET)} />
				</ModalTitle>
				<ModalContent>
					<ModalInputWrap>
						<ModalLabel>Mnemonic</ModalLabel>
						<ModalInput>
							<CopyIcon onClick={() => clipboard(mnemonic)} />
							<MnemonicContainter>
								{mnemonic !== '' && mnemonic.split(' ').map((data, index) => <Mnemonic key={index}>{data}</Mnemonic>)}
							</MnemonicContainter>
						</ModalInput>
					</ModalInputWrap>

					<Password onChange={onChangePassword} onKeyDown={onKeyDownPassword} />

					<NextButton $status={isValidString(password) ? 0 : 2} onClick={() => openConfirmModal()}>
						Next
					</NextButton>
				</ModalContent>
			</ModalContainer>
		</Modal>
	);
};

export default React.memo(NewWalletModal);
