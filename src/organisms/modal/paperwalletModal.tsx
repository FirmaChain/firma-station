import React, { useRef, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useSelector } from 'react-redux';

import { Modal } from '../../components/modal';
import { GUIDE_LINK_DOWNLOAD_PAPER_WALLET } from '../../config';
import { modalActions } from '../../redux/action';
import { rootState } from '../../redux/reducers';
import useFirma from '../../utils/wallet';
import {
	ButtonWrapper,
	CancelButton,
	DownloadButton,
	ExportPasswordWrapper,
	HelpIcon,
	InputBoxDefault,
	ModalContainer,
	ModalContent,
	ModalInputWrap,
	ModalLabel,
	ModalSubTitle,
	ModalTitle,
	ModalTooltipIcon,
	ModalTooltipTypo,
	ModalTooltipWrapper,
	paperwalletModalWidth,
	SamplePaperWallet
} from './styles';

const PaperwalletModal = () => {
	const peperwalletModalState = useSelector((state: rootState) => state.modal.paperwallet);
	const { enqueueSnackbar } = useSnackbar();
	const { isCorrectPassword, downloadPaperWallet } = useFirma();

	const [password, setPassword] = useState('');
	const inputRef = useRef(null);

	const closePaperwalletModal = () => {
		modalActions.handleModalPaperwallet(false);
	};

	const onChangePassword = (e: any) => {
		if (e === null) return;
		setPassword(e.target.value);
	};

	const onKeyDownPassword = (e: any) => {
		if (e.key === 'Enter') {
			if (password.length >= 8) {
				downloadWallet();
			}
		}
	};

	const downloadWallet = async () => {
		if (await isCorrectPassword(password)) {
			downloadPaperWallet()
				.then((uri) => {
					const a = document.createElement('a');
					a.href = uri;
					a.download = 'firma-station-paper-wallet.pdf';
					a.click();
				})
				.catch((e) => {});
		} else {
			enqueueSnackbar('Invalid Password', {
				variant: 'error',
				autoHideDuration: 2000
			});
		}
	};

	return (
		<Modal
			visible={peperwalletModalState}
			closable={true}
			visibleClose={false}
			onClose={closePaperwalletModal}
			width={paperwalletModalWidth}
		>
			<ModalContainer>
				<ModalTitle>
					Download Paper Wallet
					<HelpIcon onClick={() => window.open(GUIDE_LINK_DOWNLOAD_PAPER_WALLET)} />
				</ModalTitle>
				<ModalSubTitle>It provides a private key in a form that can be printed out.</ModalSubTitle>
				<ModalContent>
					<SamplePaperWallet />
					<ModalInputWrap>
						<ModalLabel>Password</ModalLabel>
						<ExportPasswordWrapper>
							<InputBoxDefault
								ref={inputRef}
								placeholder="********"
								type="password"
								value={password}
								onChange={onChangePassword}
								onKeyDown={onKeyDownPassword}
								autoFocus={true}
							/>
						</ExportPasswordWrapper>
					</ModalInputWrap>

					<ModalTooltipWrapper>
						<ModalTooltipIcon />
						<ModalTooltipTypo>Please download the file and store it separately in a safe place.</ModalTooltipTypo>
					</ModalTooltipWrapper>

					<ButtonWrapper>
						<CancelButton onClick={() => closePaperwalletModal()} $status={1}>
							Cancel
						</CancelButton>
						<DownloadButton
							$status={password.length >= 8 ? 0 : 2}
							onClick={() => {
								if (password.length >= 8) downloadWallet();
							}}
						>
							Download
						</DownloadButton>
					</ButtonWrapper>
				</ModalContent>
			</ModalContainer>
		</Modal>
	);
};

export default React.memo(PaperwalletModal);
