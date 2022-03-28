import React from "react";
import { useSelector } from "react-redux";

import { rootState } from "../../redux/reducers";
import { Modal } from "../../components/modal";
import { modalActions } from "../../redux/action";
import { GUIDE_LINK_LOGIN_WALLET } from "../../config";

import {
  loginModalWidth,
  ModalTitle,
  MenuListWrap,
  MenuItemWrap,
  MenuTitleTypo,
  MenuIconImg,
  NewWalletIcon,
  RecoverMnemonicIcon,
  ImportPrivateKeyIcon,
  ConnectLedgerIcon,
  HelpIcon,
} from "./styles";

const menuList = [
  { name: "New\nWallet", icon: NewWalletIcon, modalAction: modalActions.handleModalNewWallet },
  { name: "Recover from Mnemonic", icon: RecoverMnemonicIcon, modalAction: modalActions.handleModalRecoverMnemonic },
  { name: "Import\nPrivate Key", icon: ImportPrivateKeyIcon, modalAction: modalActions.handleModalImportPrivatekey },
  { name: "Connect to Ledger", icon: ConnectLedgerIcon, modalAction: modalActions.handleModalConnectLedger },
];

const LoginModal = () => {
  const loginModalState = useSelector((state: rootState) => state.modal.login);

  const closeLoginModal = () => {
    modalActions.handleModalLogin(false);
  };

  const openSubModal = (nextModalAction: (is: boolean) => void) => {
    closeLoginModal();
    nextModalAction(true);
  };

  return (
    <Modal visible={loginModalState} closable={true} onClose={closeLoginModal} width={loginModalWidth}>
      <ModalTitle>
        LOGIN WALLET
        <HelpIcon onClick={() => window.open(GUIDE_LINK_LOGIN_WALLET)} />
      </ModalTitle>
      <MenuListWrap>
        {menuList.map((menu, index) => {
          return (
            <MenuItemWrap
              key={index}
              onClick={() => {
                openSubModal(menu.modalAction);
              }}
            >
              <MenuIconImg>
                <menu.icon />
              </MenuIconImg>
              <MenuTitleTypo>{menu.name}</MenuTitleTypo>
            </MenuItemWrap>
          );
        })}
      </MenuListWrap>
    </Modal>
  );
};

export default React.memo(LoginModal);
