import React from "react";
import { useSelector } from "react-redux";
import { HeaderContainer, MenuList, MenuItem, Badge, QrWapper, QrImage, QrText } from "./styles";
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
      <QrWapper>
        <QrImage />
        <QrText>Export QR Code</QrText>
      </QrWapper>
      <MenuList>
        <MenuItem>
          <Badge />
          IMPERIUM-2
        </MenuItem>
        {isInit ? <MenuItem onClick={logout}>LOGOUT</MenuItem> : <MenuItem onClick={login}>LOGIN</MenuItem>}
      </MenuList>

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
