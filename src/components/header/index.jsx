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
} from "organisms/modal";
import { modalActions } from "redux/action";
import useFirma from "utils/firma";

function Header() {
  const { isInit } = useSelector((state) => state.wallet);
  const { resetWallet } = useFirma();

  const login = () => {
    modalActions.handleModalLogin(true);
  };
  const logout = () => {
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
          <NetworkText>IMPERIUM-2</NetworkText>
        </NetworkButton>

        <FaucetButton
          onClick={() => {
            window.open("https://faucet-devnet.firmachain.org/");
          }}
        >
          FAUCET
        </FaucetButton>

        {isInit ? (
          <LoginoutButton onClick={logout}>LOGOUT</LoginoutButton>
        ) : (
          <LoginoutButton onClick={login}>LOGIN</LoginoutButton>
        )}
      </HeaderRightWrapper>

      <LoginModal />
      <NewWalletModal />
      <ConfirmWalletModal />
      <RecoverMnemonicModal />
      <ImportPrivatekeyModal />
      <ConnectLedgerModal />
    </HeaderContainer>
  );
}

export default Header;
