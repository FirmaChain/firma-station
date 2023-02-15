import React from 'react';
import { useSelector } from 'react-redux';

import { rootState } from '../../redux/reducers';
import { Modal } from '../../components/modal';
import { modalActions } from '../../redux/action';
import { GUIDE_LINK_LOGIN_WALLET } from '../../config';

import {
  loginModalWidth,
  ModalTitle,
  HelpIcon,
  MobileAppWrapper,
  MobileAppButton,
  MobileAppButtonIcon,
  MobileAppButtonTypo,
  DividerOR,
  DividerORTypo,
  DividerORLine,
  LoginMenuListWrap,
  LoginMenuItem,
  LoginMenuButton,
  ContactUsWrapper,
  ContactUsLeftTypo,
  ContactUsRightTypo,
} from './styles';

const menuList = [
  { name: 'Create a Wallet', modalAction: modalActions.handleModalNewWallet },
  { name: 'Recover Wallet', modalAction: modalActions.handleModalRecoverMnemonic },
  { name: 'Connect to Ledger', modalAction: modalActions.handleModalConnectLedger },
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
        Login Wallet
        <HelpIcon onClick={() => window.open(GUIDE_LINK_LOGIN_WALLET)} />
      </ModalTitle>
      <MobileAppWrapper>
        <MobileAppButton onClick={() => openSubModal(modalActions.handleModalConnectApp)}>
          <MobileAppButtonIcon />
          <MobileAppButtonTypo>Connect to Mobile</MobileAppButtonTypo>
        </MobileAppButton>
      </MobileAppWrapper>
      <DividerOR>
        <DividerORLine />
        <DividerORTypo>OR</DividerORTypo>
      </DividerOR>
      <LoginMenuListWrap>
        {menuList.map((menu, index) => {
          return (
            <LoginMenuItem key={index} onClick={() => openSubModal(menu.modalAction)}>
              <LoginMenuButton status={1}>{menu.name}</LoginMenuButton>
            </LoginMenuItem>
          );
        })}
      </LoginMenuListWrap>
      <ContactUsWrapper>
        <ContactUsLeftTypo>Can't connect to wallet?</ContactUsLeftTypo>
        <ContactUsRightTypo
          onClick={() => {
            window.location.href = 'mailto:contact@firmachain.org';
          }}
        >
          Contact us
        </ContactUsRightTypo>
      </ContactUsWrapper>
    </Modal>
  );
};

export default React.memo(LoginModal);
