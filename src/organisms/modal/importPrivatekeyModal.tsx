import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";

import useFirma from "../../utils/wallet";
import { isValidString } from "../../utils/common";
import { rootState } from "../../redux/reducers";
import { Modal } from "../../components/modal";
import { modalActions } from "../../redux/action";
import { GUIDE_LINK_IMPORT_PRIVATE_KEY } from "../../config";

import Password from "./password";

import {
  importPrivatekeyModalWidth,
  ModalContainer,
  ModalTitle,
  ModalContent,
  ModalLabel,
  ModalInput,
  PrivatekeyTextArea,
  ImportButton,
  HelpIcon,
} from "./styles";

const ImportPrivatekeyModal = () => {
  const importPrivatekeyModalState = useSelector((state: rootState) => state.modal.importPrivatekey);

  const { enqueueSnackbar } = useSnackbar();
  const { storeWalletFromPrivateKey, setUserData } = useFirma(false);

  const [isActiveImportButton, activeImportButton] = useState(false);
  const [inputWords, setInputWords] = useState("");
  const [password, setPassword] = useState("");

  const inputRef = useRef<HTMLTextAreaElement>();

  const importWallet = () => {
    if (isValidString(password)) {
      storeWalletFromPrivateKey(password, inputWords)
        .then(() => {
          enqueueSnackbar("Success Import Your Wallet", {
            variant: "success",
            autoHideDuration: 2000,
          });
          setUserData();
          closeModal();
        })
        .catch((error: any) => {
          console.log(error);
          enqueueSnackbar("Invalidate Private Key", {
            variant: "error",
            autoHideDuration: 2000,
          });
        });
    } else {
      enqueueSnackbar("Invalid input fields", {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
  };

  const cancelWallet = () => {
    closeModal();
  };

  const prevModal = () => {
    closeModal();
    modalActions.handleModalLogin(true);
  };

  const closeModal = () => {
    if (inputRef.current) inputRef.current.value = "";

    activeImportButton(false);
    setInputWords("");
    modalActions.handleModalImportPrivatekey(false);
  };

  const checkWords = (e: any) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      return;
    }

    e.target.value = e.target.value.replace(/[^A-Za-z0-9]/gi, "");

    const checkValue = e.target.value.replace(/ +/g, " ").replace(/^\s+|\s+$/g, "");
    activeImportButton(checkValue.length === 66);
    setInputWords(checkValue);
  };

  const onChangePassword = (password: string) => {
    setPassword(password);
  };

  const onKeyDownPassword = () => {
    if (isActiveImportButton && isValidString(password)) importWallet();
  };

  return (
    <Modal
      visible={importPrivatekeyModalState}
      closable={true}
      onClose={cancelWallet}
      prev={prevModal}
      width={importPrivatekeyModalWidth}
    >
      <ModalContainer>
        <ModalTitle>
          IMPORT PRIVATE KEY
          <HelpIcon onClick={() => window.open(GUIDE_LINK_IMPORT_PRIVATE_KEY)} />
        </ModalTitle>
        <ModalContent>
          <ModalLabel>Private Key</ModalLabel>
          <ModalInput>
            <PrivatekeyTextArea onChange={checkWords} ref={inputRef} />
          </ModalInput>

          <Password onChange={onChangePassword} onKeyDown={onKeyDownPassword} />

          <ImportButton
            active={isActiveImportButton && isValidString(password)}
            onClick={() => {
              if (isActiveImportButton && isValidString(password)) importWallet();
            }}
          >
            Import
          </ImportButton>
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
};

export default React.memo(ImportPrivatekeyModal);
