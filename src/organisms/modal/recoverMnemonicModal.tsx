import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";

import useFirma from "../../utils/wallet";
import { useApolloClient } from "@apollo/client";
import { rootState } from "../../redux/reducers";
import { Modal } from "../../components/modal";
import { modalActions } from "../../redux/action";

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
  const [isActiveRecoverButton, activeRecoverButton] = useState(false);
  const [inputWords, setInputWords] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  const { resetWallet, initWallet, recoverWalletFromMnemonic } = useFirma();
  const { reFetchObservableQueries } = useApolloClient();

  const inputRef = useRef<HTMLTextAreaElement>();

  const recoverWallet = () => {
    recoverWalletFromMnemonic(inputWords)
      .then(() => {
        enqueueSnackbar("Success Recovered Your Wallet", {
          variant: "success",
          autoHideDuration: 1000,
        });
        reFetchObservableQueries();
        initWallet();
        closeModal();
      })
      .catch((error) => {
        console.log(error);
        enqueueSnackbar("Invalidate Mnemonic Words", {
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

  return (
    <Modal
      visible={recoverMnemonicModalState}
      closable={true}
      onClose={cancelWallet}
      prev={prevModal}
      width={recoverMnemonicModalWidth}
    >
      <ModalContainer>
        <ModalTitle>Recover from Mnemonic</ModalTitle>
        <ModalContent>
          <ModalLabel>Mnemonic</ModalLabel>
          <ModalInput>
            <MnemonicTextArea onChange={checkWords} ref={inputRef} />
          </ModalInput>
          <RecoverButton
            active={isActiveRecoverButton}
            onClick={() => {
              if (isActiveRecoverButton) recoverWallet();
            }}
          >
            RECOVER
          </RecoverButton>
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
};

export default React.memo(RecoverMnemonicModal);