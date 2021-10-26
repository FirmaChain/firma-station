import React from "react";
import { useSelector } from "react-redux";
import {
  HeaderContainer,
  HeaderRightWrapper,
  HeaderLeftWrapper,
  NetworkButton,
  FaucetButton,
  LoginoutButton,
  NetworkText,
  NetworkStatus,
  QrImage,
  QrText,
} from "./styles";
import {
  LoginModal,
  NewWalletModal,
  ConfirmWalletModal,
  RecoverMnemonicModal,
  ImportPrivatekeyModal,
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
} from "organisms/modal";
import { modalActions } from "redux/action";
import { FIRMACHAIN_CONFIG } from "config";

import useFirma from "utils/wallet";

function Header() {
  const { isInit } = useSelector((state) => state.wallet);
  const { resetWallet } = useFirma();
  const {
    login,
    newWallet,
    confirmWallet,
    recoverMnemonic,
    importPrivatekey,
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
  } = useSelector((state) => state.modal);

  const onLogin = () => {
    modalActions.handleModalLogin(true);
  };
  const onLogout = () => {
    resetWallet();
  };

  return (
    <HeaderContainer>
      <HeaderLeftWrapper>
        <QrImage />
        <QrText>Export QR Code</QrText>
      </HeaderLeftWrapper>
      <HeaderRightWrapper>
        <NetworkButton>
          <NetworkStatus />
          <NetworkText>{FIRMACHAIN_CONFIG.chainID.toUpperCase()}</NetworkText>
        </NetworkButton>

        <FaucetButton
          onClick={() => {
            window.open("https://faucet-devnet.firmachain.org/");
          }}
        >
          FAUCET
        </FaucetButton>

        {isInit ? (
          <LoginoutButton onClick={onLogout}>LOGOUT</LoginoutButton>
        ) : (
          <LoginoutButton onClick={onLogin}>LOGIN</LoginoutButton>
        )}
      </HeaderRightWrapper>

      {login && <LoginModal />}
      {newWallet && <NewWalletModal />}
      {confirmWallet && <ConfirmWalletModal />}
      {recoverMnemonic && <RecoverMnemonicModal />}
      {importPrivatekey && <ImportPrivatekeyModal />}
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

export default Header;
