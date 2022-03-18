import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";

import useFirma from "../../utils/wallet";
import { isValidString } from "../../utils/common";
import { rootState } from "../../redux/reducers";
import { Modal } from "../../components/modal";
import { modalActions } from "../../redux/action";

import Password from "./password";

import {
  recoverMnemonicModalWidth,
  ModalContainer,
  ModalTitle,
  ModalContent,
  ModalLabel,
  ModalInput,
  MnemonicTextArea,
  RecoverButton,
} from "./styles";

const RecoverMnemonicModal = () => {
  const recoverMnemonicModalState = useSelector((state: rootState) => state.modal.recoverMnemonic);

  const { enqueueSnackbar } = useSnackbar();
  const { storeWalletFromMnemonic, setUserData } = useFirma(false);

  const [isActiveRecoverButton, activeRecoverButton] = useState(false);
  const [inputWords, setInputWords] = useState("");
  const [password, setPassword] = useState("");

  const inputRef = useRef<HTMLTextAreaElement>();

  const recoverWallet = () => {
    if (isValidString(password)) {
      storeWalletFromMnemonic(password, inputWords)
        .then(() => {
          enqueueSnackbar("Success Recovered Your Wallet", {
            variant: "success",
            autoHideDuration: 2000,
          });
          setUserData();
          closeModal();
        })
        .catch((error) => {
          console.log(error);
          enqueueSnackbar("Invalidate Mnemonic Words", {
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

    activeRecoverButton(false);
    setInputWords("");
    modalActions.handleModalRecoverMnemonic(false);
  };

  const checkWords = (e: any) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      return;
    }

    e.target.value = e.target.value.replace(/[^A-Za-z\s]/gi, "");

    const checkValue = e.target.value.replace(/ +/g, " ").replace(/^\s+|\s+$/g, "");
    activeRecoverButton(checkValue.split(" ").length === 24);
    setInputWords(checkValue);
  };

  const onChangePassword = (password: string) => {
    setPassword(password);
  };

  const onKeyDownPassword = () => {
    if (isActiveRecoverButton) recoverWallet();
  };

  return (
    <Modal
      visible={recoverMnemonicModalState}
      closable={true}
      onClose={cancelWallet}
      prev={prevModal}
      width={recoverMnemonicModalWidth}
    >
      <ModalContainer>
        <ModalTitle>RECOVER FROM MNEMONIC</ModalTitle>
        <ModalContent>
          <ModalLabel>Mnemonic</ModalLabel>
          <ModalInput>
            <MnemonicTextArea onChange={checkWords} ref={inputRef} />
          </ModalInput>

          <Password onChange={onChangePassword} onKeyDown={onKeyDownPassword} />

          <RecoverButton
            active={isActiveRecoverButton}
            onClick={() => {
              if (isActiveRecoverButton) recoverWallet();
            }}
          >
            Recover
          </RecoverButton>
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
};

export default React.memo(RecoverMnemonicModal);
