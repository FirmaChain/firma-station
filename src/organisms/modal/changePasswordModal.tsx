import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';

import Password from './password';
import { rootState } from '../../redux/reducers';
import { Modal } from '../../components/modal';
import { modalActions } from '../../redux/action';

import {
  changePasswordModalWidth,
  ModalContainer,
  ModalTitle,
  ModalContent,
  ModalLabel,
  ExportPasswordWrapper,
  InputBoxDefault,
  ChangeButton,
  ButtonWrapper,
  CancelButton,
  ModalInputWrap,
} from './styles';

const ChangePasswordModal = () => {
  const changePasswordModalState = useSelector((state: rootState) => state.modal.changePassword);

  const [password, setPassword] = useState('');
  const inputRef = useRef(null);

  const closeModal = () => {
    modalActions.handleModalChangePassword(false);
  };

  const onChangePassword = (e: any) => {
    if (e === null) return;
    setPassword(e.target.value);
  };

  const onChangeNewPassword = (newPassword: string) => {};

  const onKeyDownPassword = () => {};

  return (
    <Modal
      visible={changePasswordModalState}
      closable={true}
      visibleClose={false}
      onClose={closeModal}
      width={changePasswordModalWidth}
    >
      <ModalContainer>
        <ModalTitle>Change Password</ModalTitle>
        <ModalContent>
          <ModalInputWrap>
            <ModalLabel>Current Password</ModalLabel>
            <ExportPasswordWrapper>
              <InputBoxDefault
                ref={inputRef}
                placeholder='Enter Current Password'
                type='password'
                value={password}
                onChange={onChangePassword}
                autoFocus={true}
              />
            </ExportPasswordWrapper>
          </ModalInputWrap>
          <Password onChange={onChangeNewPassword} onKeyDown={onKeyDownPassword} />

          <ButtonWrapper>
            <CancelButton onClick={() => closeModal()} status={1}>
              Cancel
            </CancelButton>
            <ChangeButton status={0}>Change</ChangeButton>
          </ButtonWrapper>
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
};

export default React.memo(ChangePasswordModal);
