import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";

import { copyToClipboard } from "../../utils/common";
import { FIRMACHAIN_CONFIG } from "../../config";
import { modalActions } from "../../redux/action";
import { rootState } from "../../redux/reducers";
import { useAvataURL, useUserData } from "./hooks";
import useFirma from "../../utils/wallet";

import {
  QRCodeModal,
  NetworksModal,
  LoginModal,
  SettingsModal,
  NewWalletModal,
  ConfirmWalletModal,
  RecoverMnemonicModal,
  ImportPrivatekeyModal,
  ExportPrivatekeyModal,
  ExportMnemonicModal,
  ChangePasswordModal,
  ConnectLedgerModal,
  DelegateModal,
  RedelegateModal,
  UndelegateModal,
  DepositModal,
  VotingModal,
  NewProposalModal,
  SendModal,
  ConfirmTxModal,
  QueueTxModal,
  ResultTxModal,
} from "../modal";

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
} from "./styles";

function Header() {
  const { enqueueSnackbar } = useSnackbar();
  const { isInit, isLedger, address } = useSelector((state: rootState) => state.wallet);
  const {
    qrcode,
    network,
    login,
    settings,
    newWallet,
    confirmWallet,
    recoverMnemonic,
    importPrivatekey,
    exportPrivatekey,
    exportMnemonic,
    changePassword,
    connectLedger,
    delegate,
    redelegate,
    undelegate,
    deposit,
    voting,
    newProposal,
    send,
    confirmTx,
    queueTx,
    resultTx,
  } = useSelector((state: rootState) => state.modal);

  const { avatarURL } = useAvataURL(address);
  const { showAddressOnDevice } = useFirma();

  useUserData();

  const onLogin = () => {
    modalActions.handleModalLogin(true);
  };

  const onNetwork = () => {
    // modalActions.handleModalNetwork(true);
  };

  const clipboard = () => {
    copyToClipboard(address);

    enqueueSnackbar("Copied", {
      variant: "success",
      autoHideDuration: 1000,
    });
  };

  const onSettings = () => {
    modalActions.handleModalSettings(true);
  };

  const onClickLedger = () => {
    showAddressOnDevice()
      .then(() => {})
      .catch(() => {
        enqueueSnackbar("Failed connect ledger", {
          variant: "success",
          autoHideDuration: 1000,
        });
      });
  };

  return (
    <HeaderContainer>
      <HeaderLeftWrapper>
        <NetworkButton onClick={onNetwork}>
          <NetworkStatus />
          <NetworkText>{FIRMACHAIN_CONFIG.chainID.toUpperCase()}</NetworkText>
        </NetworkButton>
      </HeaderLeftWrapper>

      <HeaderRightWrapper>
        {isInit && (
          <HeaderLeftWrapper>
            <ProfileImg src={avatarURL} />
            <AddressTypo onClick={clipboard}>{address}</AddressTypo>
            <BarDiv />
            {isLedger && <LedgerIconImg onClick={onClickLedger} />}
            <CopyIconImg onClick={clipboard} />
            <SettingIconImg onClick={onSettings} />
          </HeaderLeftWrapper>
        )}
        {isInit === false && (
          <LoginWrap onClick={onLogin}>
            <LoginIconImg />
            <HeaderTypo>Login</HeaderTypo>
          </LoginWrap>
        )}
      </HeaderRightWrapper>

      {qrcode && <QRCodeModal />}
      {network && <NetworksModal />}
      {login && <LoginModal />}
      {settings && <SettingsModal />}
      {newWallet && <NewWalletModal />}
      {confirmWallet && <ConfirmWalletModal />}
      {recoverMnemonic && <RecoverMnemonicModal />}
      {importPrivatekey && <ImportPrivatekeyModal />}
      {exportPrivatekey && <ExportPrivatekeyModal />}
      {exportMnemonic && <ExportMnemonicModal />}
      {changePassword && <ChangePasswordModal />}
      {connectLedger && <ConnectLedgerModal />}
      {delegate && <DelegateModal />}
      {redelegate && <RedelegateModal />}
      {undelegate && <UndelegateModal />}
      {deposit && <DepositModal />}
      {voting && <VotingModal />}
      {newProposal && <NewProposalModal />}
      {send && <SendModal />}
      {confirmTx && <ConfirmTxModal />}
      {queueTx && <QueueTxModal />}
      {resultTx && <ResultTxModal />}
    </HeaderContainer>
  );
}

export default React.memo(Header);
