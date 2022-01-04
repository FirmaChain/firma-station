import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
// import { useSnackbar } from "notistack";

import Password from "./password";
// import useFirma from "../../utils/wallet";
import { rootState } from "../../redux/reducers";
import { Modal } from "../../components/modal";
import { modalActions } from "../../redux/action";

import {
  exportPrivatekeyModalWidth,
  ModalContainer,
  ModalTitle,
  ModalContent,
  ModalLabel,
  ExportPasswordWrapper,
  InputBoxDefault,
  ChangeButton,
} from "./styles";

const ChangePasswordModal = () => {
  const changePasswordModalState = useSelector((state: rootState) => state.modal.changePassword);
  // const { isCorrectPassword } = useFirma();
  // const { enqueueSnackbar } = useSnackbar();

  const [password, setPassword] = useState("");
  // const [newPassword, setNewPassword] = useState("");
  const inputRef = useRef(null);

  const closeModal = () => {
    modalActions.handleModalChangePassword(false);
  };

  const onChangePassword = (e: any) => {
    if (e === null) return;
    setPassword(e.target.value);
  };

  const onChangeNewPassword = (newPassword: string) => {
    // setNewPassword(newPassword);
  };

  const onKeyDownPassword = () => {};

  return (
    <Modal
      visible={changePasswordModalState}
      maskClosable={true}
      closable={true}
      onClose={closeModal}
      width={exportPrivatekeyModalWidth}
    >
      <ModalContainer>
        <ModalTitle>CHANGE PASSWORD</ModalTitle>
        <ModalContent>
          <ModalLabel>Current Password</ModalLabel>
          <ExportPasswordWrapper style={{ marginBottom: "50px" }}>
            <InputBoxDefault
              ref={inputRef}
              placeholder="********"
              type="password"
              value={password}
              onChange={onChangePassword}
              autoFocus={true}
            />
          </ExportPasswordWrapper>

          <Password onChange={onChangeNewPassword} onKeyDown={onKeyDownPassword} />

          <ChangeButton active={true}>change</ChangeButton>
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
};

export default React.memo(ChangePasswordModal);
