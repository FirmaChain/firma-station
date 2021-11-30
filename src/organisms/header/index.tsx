import React from "react";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";

import { copyToClipboard } from "../../utils/common";
import { FIRMACHAIN_CONFIG } from "../../config";
import { modalActions } from "../../redux/action";
import { rootState } from "../../redux/reducers";
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
  LoginoutButton,
  NetworkText,
  NetworkStatus,
  AddressTypo,
  CopyIconImg,
  SettingIconImg,
} from "./styles";

function Header() {
  const { enqueueSnackbar } = useSnackbar();
  const { isInit, address } = useSelector((state: rootState) => state.wallet);
  const { resetWallet } = useFirma();
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

  const onLogin = () => {
    modalActions.handleModalLogin(true);
  };
  const onLogout = () => {
    resetWallet();
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
  return (
    <HeaderContainer>
      <HeaderLeftWrapper></HeaderLeftWrapper>
      {isInit && (
        <HeaderLeftWrapper>
          <AddressTypo>{address}</AddressTypo>
          <CopyIconImg onClick={clipboard} />
          <SettingIconImg onClick={onSettings} />
        </HeaderLeftWrapper>
      )}
      <HeaderRightWrapper>
        <NetworkButton onClick={onNetwork}>
          <NetworkStatus />
          <NetworkText>{FIRMACHAIN_CONFIG.chainID.toUpperCase()}</NetworkText>
        </NetworkButton>
        {/* {FAUCET_URI && (
          <FaucetButton
            onClick={() => {
              window.open(FAUCET_URI);
            }}
          >
            FAUCET
          </FaucetButton>
        )} */}
        {isInit ? (
          <LoginoutButton onClick={onLogout}>LOGOUT</LoginoutButton>
        ) : (
          <LoginoutButton onClick={onLogin}>LOGIN</LoginoutButton>
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
