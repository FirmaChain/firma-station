import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import useFirma from "utils/wallet";

import { Modal } from "components/modal";
import { modalActions } from "redux/action";

import {
  importPrivatekeyModalWidth,
  ModalContainer,
  ModalTitle,
  ModalContent,
  ModalLabel,
  ModalInput,
  PrivatekeyTextArea,
  ImportButton,
} from "./styles";

const ImportPrivatekeyModal = () => {
  const importPrivatekeyModalState = useSelector((state) => state.modal.importPrivatekey);
  const [isActiveImportButton, activeImportButton] = useState(false);
  const [inputWords, setInputWords] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const { resetWallet, initWallet, recoverWalletFromPrivateKey } = useFirma();

  const inputRef = useRef();

  const importWallet = () => {
    recoverWalletFromPrivateKey(inputWords)
      .then(() => {
        enqueueSnackbar("Success Import Your Wallet", {
          variant: "success",
          autoHideDuration: 1000,
        });
        initWallet();
        closeModal();
      })
      .catch((error) => {
        console.log(error);
        enqueueSnackbar("Invalidate Private Key", {
          variant: "error",
          autoHideDuration: 1000,
        });
      });
  };

  const cancelWallet = () => {
    resetWallet();
    closeModal();
  };

  const prevModal = () => {
    closeModal();
    modalActions.handleModalLogin(true);
  };

  const closeModal = () => {
    inputRef.current.value = "";
    activeImportButton(false);
    setInputWords("");
    modalActions.handleModalImportPrivatekey(false);
  };

  const checkWords = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      return;
    }

    e.target.value = e.target.value.replace(/[^A-Za-z0-9]/gi, "");

    const checkValue = e.target.value.replace(/ +/g, " ").replace(/^\s+|\s+$/g, "");
    activeImportButton(checkValue.length === 66);
    setInputWords(checkValue);
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
        <ModalTitle>Import Private Key</ModalTitle>
        <ModalContent>
          <ModalLabel>Private Key</ModalLabel>
          <ModalInput>
            <PrivatekeyTextArea onChange={checkWords} ref={inputRef} />
          </ModalInput>
          <ImportButton
            active={isActiveImportButton}
            onClick={() => {
              if (isActiveImportButton) importWallet();
            }}
          >
            IMPORT
          </ImportButton>
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
};

export default ImportPrivatekeyModal;
