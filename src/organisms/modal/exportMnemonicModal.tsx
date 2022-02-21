import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";

import useFirma from "../../utils/wallet";
import { copyToClipboard } from "../../utils/common";
import { rootState } from "../../redux/reducers";
import { Modal } from "../../components/modal";
import { modalActions } from "../../redux/action";

import {
  exportMnemonicModalWidth,
  ModalContainer,
  ModalTitle,
  ModalContent,
  ModalLabel,
  ModalInput,
  ExportPasswordWrapper,
  InputBoxDefault,
  ExportButton,
  CopyIcon,
} from "./styles";

const ExportMnemonicModal = () => {
  const exportMnemonicModalState = useSelector((state: rootState) => state.modal.exportMnemonic);
  const { isCorrectPassword, getDecryptMnemonic } = useFirma();
  const { enqueueSnackbar } = useSnackbar();

  const [password, setPassword] = useState("");
  const [mnemonic, setMnemonic] = useState("");
  const inputRef = useRef(null);

  const exportWallet = () => {
    if (isCorrectPassword(password)) {
      const mnemonic = getDecryptMnemonic();

      if (mnemonic === "") {
        enqueueSnackbar("Faild get Mnemonic (Private Key User)", {
          variant: "error",
          autoHideDuration: 2000,
        });
      }
      setMnemonic(getDecryptMnemonic());
    } else {
      enqueueSnackbar("Invalid Password", {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
  };

  const clipboard = () => {
    copyToClipboard(mnemonic);

    enqueueSnackbar("Copied", {
      variant: "success",
      autoHideDuration: 1000,
    });
  };

  const closeModal = () => {
    modalActions.handleModalExportMnemonic(false);
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
      visible={exportMnemonicModalState}
      maskClosable={true}
      closable={true}
      onClose={closeModal}
      width={exportMnemonicModalWidth}
    >
      <ModalContainer>
        <ModalTitle>EXPORT MNEMONIC</ModalTitle>
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
          {mnemonic !== "" && (
            <>
              <ModalLabel>Mnemonic</ModalLabel>
              <ModalInput>
                <CopyIcon onClick={clipboard} />
                {mnemonic}
              </ModalInput>
            </>
          )}
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
};

export default React.memo(ExportMnemonicModal);
