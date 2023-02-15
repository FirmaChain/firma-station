import React from 'react';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { isMobile, isTablet } from 'react-device-detect';

import useFirma from '../../utils/wallet';
import { copyToClipboard, isExternalConnect } from '../../utils/common';
import { CHAIN_CONFIG } from '../../config';
import { modalActions } from '../../redux/action';
import { rootState } from '../../redux/reducers';

import {
  PaperwalletModal,
  QRCodeModal,
  LoginModal,
  SettingsModal,
  NewWalletModal,
  ConfirmWalletModal,
  RecoverModal,
  ExportPrivatekeyModal,
  ExportMnemonicModal,
  ChangePasswordModal,
  ConnectLedgerModal,
  ConnectAppModal,
  DelegateModal,
  RedelegateModal,
  UndelegateModal,
  DepositModal,
  VotingModal,
  NewProposalModal,
  SendModal,
  ConfirmTxModal,
  QueueTxModal,
  GasEstimationModal,
  RestakeModal,
  DisconnectModal,
} from '../modal';

import {
  HeaderContainer,
  HeaderRightWrapper,
  HeaderLeftWrapper,
  NetworkButton,
  NetworkText,
  NetworkStatus,
  AddressTypo,
  CopyIconImg,
  SettingIconImg,
  LoginWrap,
  HeaderTypo,
  LoginIconImg,
  ProfileImg,
  BarDiv,
  LedgerIconImg,
  QrIconImg,
  LockIconImg,
  LogoutImg,
} from './styles';

function HeaderDesktop() {
  const { enqueueSnackbar } = useSnackbar();
  const { isInit, isLedger, isMobileApp, address } = useSelector((state: rootState) => state.wallet);
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
    undelegate,
    deposit,
    voting,
    newProposal,
    send,
    confirmTx,
    queueTx,
    gasEstimation,
    restake,
  } = useSelector((state: rootState) => state.modal);

  const { showAddressOnDevice, checkSession } = useFirma();

  const onLogin = () => {
    modalActions.handleModalLogin(true);
  };

  const clipboard = () => {
    copyToClipboard(address);

    enqueueSnackbar('Copied', {
      variant: 'success',
      autoHideDuration: 1000,
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
          autoHideDuration: 2000,
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
              <ProfileImg src={''} />
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
            <LoginWrap onClick={onLogin}>
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
