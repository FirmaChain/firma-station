import React from 'react';
import { useSelector } from 'react-redux';

import useFirma from '../../utils/wallet';
import { rootState } from '../../redux/reducers';
import { Modal } from '../../components/modal';
import { modalActions } from '../../redux/action';
import { GUIDE_LINK_WALLET_SETTING } from '../../config';

import {
  settingModalWidth,
  ModalContainer,
  ModalTitle,
  HelpIcon,
  DividerOR,
  DividerORTypo,
  DividerORLine,
  SettingMenuListWrap,
  SettingMenuItem,
  SettingMenuButton,
  DisconnectButton,
} from './styles';

const ExportWalletModal = () => {
  const exportWalletModalState = useSelector((state: rootState) => state.modal.settings);
  const { resetWallet } = useFirma();

  const menuList = [
    { name: 'Download\nPaper Wallet', modalAction: modalActions.handleModalPaperwallet },
    { name: 'Export\nMnemonic', modalAction: modalActions.handleModalExportMnemonic },
    { name: 'Export\nPrivate key', modalAction: modalActions.handleModalExportPrivatekey },
  ];

  const closeExportWalletModal = () => {
    modalActions.handleModalSettings(false);
  };

  const openSubModal = (nextModalAction: (is: boolean) => void) => {
    closeExportWalletModal();
    nextModalAction(true);
  };

  return (
    <Modal visible={exportWalletModalState} closable={true} onClose={closeExportWalletModal} width={settingModalWidth}>
      <ModalContainer>
        <ModalTitle>
          Wallet Setting
          <HelpIcon onClick={() => window.open(GUIDE_LINK_WALLET_SETTING)} />
        </ModalTitle>

        <SettingMenuListWrap>
          {menuList.map((menu, index) => {
            return (
              <SettingMenuItem key={index} onClick={() => openSubModal(menu.modalAction)}>
                <SettingMenuButton status={1}>{menu.name}</SettingMenuButton>
              </SettingMenuItem>
            );
          })}
        </SettingMenuListWrap>
        <DividerOR>
          <DividerORLine />
          <DividerORTypo>OR</DividerORTypo>
        </DividerOR>
        <DisconnectButton
          status={3}
          onClick={() => {
            resetWallet();
            closeExportWalletModal();
          }}
        >
          Disconnect your Wallet
        </DisconnectButton>
      </ModalContainer>
    </Modal>
  );
};

export default React.memo(ExportWalletModal);
