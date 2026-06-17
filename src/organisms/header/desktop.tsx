import React from 'react';
import { useSnackbar } from 'notistack';
import { isMobile, isTablet } from 'react-device-detect';

import { CHAIN_CONFIG } from '../../config';
import { modalActions, useModalStore, useWalletStore } from '../../store';
import { copyToClipboard, isExternalConnect } from '../../utils/common';
import useFirma from '../../utils/wallet';
import {
	ChangePasswordModal,
	ConfirmTxModal,
	ConfirmWalletModal,
	ConnectAppModal,
	ConnectLedgerModal,
	DelegateModal,
	DepositModal,
	DisconnectModal,
	ExportMnemonicModal,
	ExportPrivatekeyModal,
	GasEstimationModal,
	LoginModal,
	NewProposalModal,
	NewWalletModal,
	PaperwalletModal,
	QRCodeModal,
	QueueTxModal,
	RecoverModal,
	RedelegateModal,
	RedelegateRestakeModal,
	RestakeModal,
	SendModal,
	SettingsModal,
	UndelegateModal,
	VotingModal
} from '../modal';
import {
	AddressTypo,
	BarDiv,
	CopyIconImg,
	HeaderContainer,
	HeaderLeftWrapper,
	HeaderRightWrapper,
	HeaderTypo,
	LedgerIconImg,
	LockIconImg,
	LoginIconImg,
	LoginWrap,
	LogoutImg,
	NetworkButton,
	NetworkStatus,
	NetworkText,
	ProfileImg,
	QrIconImg,
	SettingIconImg
} from './styles';

function HeaderDesktop() {
	const { enqueueSnackbar } = useSnackbar();
	const { isInit, isLedger, isMobileApp, address } = useWalletStore((state) => state);
	const {
		paperwallet,
		qrcode,
		login,
		settings,
		disconnect,
		newWallet,
		confirmWallet,
		recoverMnemonic,
		exportPrivatekey,
		exportMnemonic,
		changePassword,
		connectLedger,
		connectApp,
		delegate,
		redelegate,
		redelegateRestake,
		undelegate,
		deposit,
		voting,
		newProposal,
		send,
		confirmTx,
		queueTx,
		gasEstimation,
		restake
	} = useModalStore((state) => state);

	const { showAddressOnDevice, checkSession } = useFirma();

	const onLogin = () => {
		modalActions.handleModalLogin(true);
	};

	const clipboard = () => {
		copyToClipboard(address);

		enqueueSnackbar('Copied', {
			variant: 'success',
			autoHideDuration: 1000
		});
	};

	const onSettings = () => {
		modalActions.handleModalSettings(true);
	};

	const onDisconnect = () => {
		modalActions.handleModalDisconnect(true);
	};

	const onClickLedger = () => {
		showAddressOnDevice()
			.then(() => {})
			.catch(() => {
				enqueueSnackbar('Failed connect ledger', {
					variant: 'success',
					autoHideDuration: 2000
				});
			});
	};

	const onClickQR = () => {
		modalActions.handleModalQRCode(true);
	};

	return (
		<HeaderContainer>
			<HeaderLeftWrapper>
				<NetworkButton>
					<NetworkStatus />
					<NetworkText>{CHAIN_CONFIG.FIRMACHAIN_CONFIG.chainID.toUpperCase()}</NetworkText>
				</NetworkButton>
			</HeaderLeftWrapper>
			{(isMobile || isTablet) === false && (
				<HeaderRightWrapper>
					{isInit && (
						<HeaderLeftWrapper>
							<ProfileImg $src={undefined} />
							<AddressTypo onClick={clipboard}>{address}</AddressTypo>
							<BarDiv />
							{!isExternalConnect(isLedger, isMobileApp) && <LockIconImg onClick={() => checkSession()} />}
							{isLedger && <LedgerIconImg onClick={onClickLedger} />}
							<QrIconImg onClick={onClickQR} />
							<CopyIconImg onClick={clipboard} />
							{isExternalConnect(isLedger, isMobileApp) ? (
								<LogoutImg onClick={onDisconnect} />
							) : (
								<SettingIconImg onClick={onSettings} />
							)}
						</HeaderLeftWrapper>
					)}
					{isInit === false && (
						<LoginWrap onClick={onLogin} data-testid="header-login-button">
							<LoginIconImg />
							<HeaderTypo>Login</HeaderTypo>
						</LoginWrap>
					)}
				</HeaderRightWrapper>
			)}

			{paperwallet && <PaperwalletModal />}
			{qrcode && <QRCodeModal />}
			{login && <LoginModal />}
			{settings && <SettingsModal />}
			{newWallet && <NewWalletModal />}
			{confirmWallet && <ConfirmWalletModal />}
			{recoverMnemonic && <RecoverModal />}
			{exportPrivatekey && <ExportPrivatekeyModal />}
			{exportMnemonic && <ExportMnemonicModal />}
			{changePassword && <ChangePasswordModal />}
			{connectLedger && <ConnectLedgerModal />}
			{connectApp && <ConnectAppModal />}
			{disconnect && <DisconnectModal />}
			{delegate && <DelegateModal />}
			{redelegate && <RedelegateModal />}
			{redelegateRestake && <RedelegateRestakeModal />}
			{undelegate && <UndelegateModal />}
			{deposit && <DepositModal />}
			{voting && <VotingModal />}
			{newProposal && <NewProposalModal />}
			{send && <SendModal />}
			{confirmTx && <ConfirmTxModal />}
			{queueTx && <QueueTxModal />}
			{gasEstimation && <GasEstimationModal />}
			{restake && <RestakeModal />}
		</HeaderContainer>
	);
}

export default React.memo(HeaderDesktop);
