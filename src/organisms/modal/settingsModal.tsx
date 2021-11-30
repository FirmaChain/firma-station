import React from "react";
import { useSelector } from "react-redux";

import { rootState } from "../../redux/reducers";
import { Modal } from "../../components/modal";
import { modalActions } from "../../redux/action";

import {
  exportWalletModalWidth,
  ModalContainer,
  ModalTitle,
  MenuListWrap,
  MenuItemWrap,
  MenuTitleTypo,
  MenuIconImg,
  ImportPrivateKeyIcon,
  QrCodeIcon,
} from "./styles";

const menuList = [
  { name: "Export\nQR Code", icon: QrCodeIcon, modalAction: modalActions.handleModalQRCode },
  { name: "Export\nprivate key", icon: ImportPrivateKeyIcon, modalAction: modalActions.handleModalExportPrivatekey },
  { name: "Export\nmnemonic", icon: ImportPrivateKeyIcon, modalAction: modalActions.handleModalExportMnemonic },
  // { name: "Change\npassword", icon: ImportPrivateKeyIcon, modalAction: modalActions.handleModalChangePassword },
];

const ExportWalletModal = () => {
  const exportWalletModalState = useSelector((state: rootState) => state.modal.settings);

  const closeExportWalletModal = () => {
    modalActions.handleModalSettings(false);
  };

  const openSubModal = (nextModalAction: (is: boolean) => void) => {
    closeExportWalletModal();
    nextModalAction(true);
  };

  return (
    <Modal
      visible={exportWalletModalState}
      closable={true}
      maskClosable={true}
      onClose={closeExportWalletModal}
      width={exportWalletModalWidth}
    >
      <ModalContainer>
        <ModalTitle>Settings Wallet</ModalTitle>
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
      </ModalContainer>
    </Modal>
  );
};

export default React.memo(ExportWalletModal);
