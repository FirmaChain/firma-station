import React from "react";

import { HeaderContainer, MenuList, MenuItem, Badge, QrWapper, QrImage, QrText } from "./styles";
import {
  LoginModal,
  NewWalletModal,
  RecoverMnemonicModal,
  ImportPrivatekeyModal,
  ConnectLedgerModal,
} from "organisms/modal";
import { modalActions } from "redux/action";

function Header() {
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
        <MenuItem style={{ cursor: "pointer" }} onClick={() => modalActions.handleLoginModal(true)}>
          LOGIN
        </MenuItem>
      </MenuList>

      <LoginModal />
      <NewWalletModal />
      <RecoverMnemonicModal />
      <ImportPrivatekeyModal />
      <ConnectLedgerModal />
    </HeaderContainer>
  );
}

export default Header;
