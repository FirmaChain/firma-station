import React from "react";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";

import useFirma from "../../utils/wallet";
import { rootState } from "../../redux/reducers";
import { Modal } from "../../components/modal";
import { modalActions } from "../../redux/action";
import { GUIDE_LINK_WALLET_SETTING } from "../../config";

import {
  exportWalletModalWidth,
  ModalContainer,
  ModalTitle,
  MenuListWrap,
  MenuItemWrap,
  MenuTitleTypo,
  MenuIconImg,
  ImportPrivateKeyIcon,
  LogoutIcon,
  PictureAsPdfIcon,
  HelpIcon,
} from "./styles";

const ExportWalletModal = () => {
  const exportWalletModalState = useSelector((state: rootState) => state.modal.settings);
  const { enqueueSnackbar } = useSnackbar();
  const { isLedger } = useSelector((state: rootState) => state.wallet);
  const { resetWallet } = useFirma();

  const menuList = [
    { name: "Download\npaper wallet", icon: PictureAsPdfIcon, modalAction: modalActions.handleModalPaperwallet },
    { name: "Export\nmnemonic", icon: ImportPrivateKeyIcon, modalAction: modalActions.handleModalExportMnemonic },
    { name: "Export\nprivate key", icon: ImportPrivateKeyIcon, modalAction: modalActions.handleModalExportPrivatekey },
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
        <ModalTitle>
          WALLET SETTING
          <HelpIcon onClick={() => window.open(GUIDE_LINK_WALLET_SETTING)} />
        </ModalTitle>
        <MenuListWrap>
          {menuList.map((menu, index) => {
            return (
              <MenuItemWrap
                key={index}
                disabled={isLedger && index !== 3}
                onClick={() => {
                  if (isLedger && index !== 3) {
                    enqueueSnackbar("It's not available on Ledger", {
                      variant: "error",
                      autoHideDuration: 2000,
                    });
                  } else {
                    openSubModal(menu.modalAction);
                  }
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
