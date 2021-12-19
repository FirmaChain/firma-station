import React from "react";
import { useSelector } from "react-redux";

import useFirma from "../../utils/wallet";
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
  LogoutIcon,
} from "./styles";

const ExportWalletModal = () => {
  const exportWalletModalState = useSelector((state: rootState) => state.modal.settings);
  const { isLedger } = useSelector((state: rootState) => state.wallet);
  const { resetWallet } = useFirma();

  const menuList = [
    { name: "Export\nQR Code", icon: QrCodeIcon, modalAction: modalActions.handleModalQRCode },
    { name: "Export\nprivate key", icon: ImportPrivateKeyIcon, modalAction: modalActions.handleModalExportPrivatekey },
    { name: "Export\nmnemonic", icon: ImportPrivateKeyIcon, modalAction: modalActions.handleModalExportMnemonic },
    { name: "Disconnect\nyour wallet", icon: LogoutIcon, modalAction: resetWallet },
  ];

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
            if (isLedger && (index === 1 || index === 2)) return;

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
