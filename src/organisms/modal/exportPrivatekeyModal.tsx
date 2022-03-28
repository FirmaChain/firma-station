import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";

import useFirma from "../../utils/wallet";
import { copyToClipboard } from "../../utils/common";
import { rootState } from "../../redux/reducers";
import { Modal } from "../../components/modal";
import { modalActions } from "../../redux/action";
import { GUIDE_LINK_EXPORT_PRIVATE_KEY } from "../../config";

import {
  exportPrivatekeyModalWidth,
  ModalContainer,
  ModalTitle,
  ModalContent,
  ModalLabel,
  ModalInput,
  ExportPasswordWrapper,
  InputBoxDefault,
  ExportButton,
  CopyIcon,
  HelpIcon,
} from "./styles";

const ExportPrivatekeyModal = () => {
  const exportPrivatekeyModalState = useSelector((state: rootState) => state.modal.exportPrivatekey);
  const { isCorrectPassword, getDecryptPrivateKey } = useFirma();
  const { enqueueSnackbar } = useSnackbar();

  const [password, setPassword] = useState("");
  const [privatekey, setPrivatekey] = useState("");
  const inputRef = useRef(null);

  const exportWallet = () => {
    if (isCorrectPassword(password)) {
      setPrivatekey(getDecryptPrivateKey());
    } else {
      enqueueSnackbar("Invalid Password", {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
  };

  const clipboard = () => {
    copyToClipboard(privatekey);

    enqueueSnackbar("Copied", {
      variant: "success",
      autoHideDuration: 1000,
    });
  };

  const closeModal = () => {
    modalActions.handleModalExportPrivatekey(false);
  };

  const onChangePassword = (e: any) => {
    if (e === null) return;
    setPassword(e.target.value);
  };

  const onKeyDownPassword = (e: any) => {
    if (e.key === "Enter") {
      if (password.length >= 8) exportWallet();
    }
  };

  return (
    <Modal
      visible={exportPrivatekeyModalState}
      maskClosable={true}
      closable={true}
      onClose={closeModal}
      width={exportPrivatekeyModalWidth}
    >
      <ModalContainer>
        <ModalTitle>
          EXPORT PRIVATE KEY
          <HelpIcon onClick={() => window.open(GUIDE_LINK_EXPORT_PRIVATE_KEY)} />
        </ModalTitle>
        <ModalContent>
          <ModalLabel>Password</ModalLabel>
          <ExportPasswordWrapper>
            <InputBoxDefault
              ref={inputRef}
              placeholder="********"
              type="password"
              value={password}
              onChange={onChangePassword}
              onKeyDown={onKeyDownPassword}
              autoFocus={true}
            />
          </ExportPasswordWrapper>
          <ExportButton
            active={password.length >= 8}
            onClick={() => {
              if (password.length >= 8) exportWallet();
            }}
          >
            Export
          </ExportButton>
          {privatekey !== "" && (
            <>
              <ModalLabel>Private Key</ModalLabel>
              <ModalInput>
                <CopyIcon onClick={clipboard} />
                {privatekey}
              </ModalInput>
            </>
          )}
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
};

export default React.memo(ExportPrivatekeyModal);
