import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

import { Modal } from "components/modal";
import { modalActions } from "redux/action";

import NewWalletIcon from "@mui/icons-material/AddBox";
import RecoverMnemonicIcon from "@mui/icons-material/Restore";
import ImportPrivateKeyIcon from "@mui/icons-material/ImportExport";
import ConnectLedgerIcon from "@mui/icons-material/Usb";

const menuList = [
  { name: "New\nWallet", icon: NewWalletIcon, modalAction: modalActions.handleNewWalletModal },
  { name: "Recover from Mnemonic", icon: RecoverMnemonicIcon, modalAction: modalActions.handleRecoverMnemonicModal },
  { name: "Import\nPrivate Key", icon: ImportPrivateKeyIcon, modalAction: modalActions.handleImportPrivatekeyModal },
  { name: "Connection to Ledger", icon: ConnectLedgerIcon, modalAction: modalActions.handleConnectLedgerModal },
];

const MenuListWrap = styled.div`
  height: 150px;
  display: flex;
  align-items: center;
  gap: 0 30px;
  margin: 10px 20px 0 20px;
  white-space: pre-wrap;
`;

const MenuItemWrap = styled.div`
  height: 70px;
  padding: 30px 10px;
  flex: 1;
  border: 1px solid #324ab8aa;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #324ab8aa;
  }
`;

const MenuTitleTypo = styled.div`
  line-height: 20px;
  text-align: center;
  margin: 0 20px;
  color: #eee;
`;

const MenuIconImg = styled.div`
  text-align: center;
  margin-bottom: 8px;
`;

function LoginModal() {
  const loginModalState = useSelector((state) => state.modal.loginModal);

  const closeLoginModal = () => {
    modalActions.handleLoginModal(false);
  };

  const openSubModal = (modalAction) => {
    closeLoginModal();
    modalAction(true);
  };

  return (
    <Modal visible={loginModalState} closable={true} maskClosable={true} onClose={closeLoginModal} width={"900px"}>
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
}

export default LoginModal;
