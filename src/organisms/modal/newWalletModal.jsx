import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";

import { Modal } from "components/modal";
import { modalActions } from "redux/action";

import useFirma from "utils/firma";

import {
  ModalContainer,
  ModalTitle,
  ModalContent,
  ModalLabel,
  ModalInput,
  MnemonicContainter,
  Mnemonic,
  CopyIcon,
  NextButton,
} from "./styles";

function NewWalletModal() {
  const newWalletModalState = useSelector((state) => state.modal.newWallet);
  const { mnemonic, privateKey, address } = useSelector((state) => state.wallet);
  const { enqueueSnackbar } = useSnackbar();
  const { generateWallet } = useFirma();

  useEffect(() => {
    if (newWalletModalState) {
      generateWallet();
    }
  }, [newWalletModalState]);

  const closeNewWalletModal = () => {
    modalActions.handleModalNewWallet(false);
  };

  const openConfirmModal = () => {
    closeNewWalletModal();
    modalActions.handleModalConfirmWallet(true);
  };

  const prevModal = () => {
    closeNewWalletModal();
    modalActions.handleModalLogin(true);
  };

  const copyMnemonic = () => {
    const textarea = document.createElement("textarea");
    textarea.value = mnemonic;
    textarea.style.top = 0;
    textarea.style.left = 0;
    textarea.style.position = "fixed";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);

    enqueueSnackbar("Copied", {
      variant: "success",
      autoHideDuration: 1000,
    });
  };

  return (
    <Modal
      visible={newWalletModalState}
      closable={true}
      maskClosable={true}
      onClose={closeNewWalletModal}
      prev={prevModal}
      width={"650px"}
    >
      <ModalContainer>
        <ModalTitle>New Wallet</ModalTitle>
        <ModalContent>
          <ModalLabel>Mnemonic</ModalLabel>
          <ModalInput>
            <CopyIcon onClick={() => copyMnemonic()} />
            <MnemonicContainter>
              {mnemonic.split(" ").map((data, index) => (
                <Mnemonic key={index}>{data}</Mnemonic>
              ))}
            </MnemonicContainter>
          </ModalInput>

          <ModalLabel>Private Key</ModalLabel>
          <ModalInput>{privateKey}</ModalInput>

          <ModalLabel>Address</ModalLabel>
          <ModalInput>{address}</ModalInput>

          <NextButton onClick={() => openConfirmModal()}>NEXT</NextButton>
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
}

export default NewWalletModal;
