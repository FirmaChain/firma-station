import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";

import { Modal } from "components/modal";
import { modalActions } from "redux/action";

import useFirma from "utils/firma";

import {
  newWalletModalWidth,
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

const NewWalletModal = () => {
  const newWalletModalState = useSelector((state) => state.modal.newWallet);
  const { mnemonic, privateKey, address } = useSelector((state) => state.wallet);
  const { enqueueSnackbar } = useSnackbar();
  const { generateWallet, resetWallet } = useFirma();

  useEffect(() => {
    if (newWalletModalState) {
      generateWallet();
    }
  }, [newWalletModalState]);

  const closeNewWalletModal = () => {
    resetWallet();
    closeModal();
  };

  const openConfirmModal = () => {
    closeModal();
    modalActions.handleModalConfirmWallet(true);
  };

  const prevModal = () => {
    closeNewWalletModal();
    modalActions.handleModalLogin(true);
  };

  const closeModal = () => {
    modalActions.handleModalNewWallet(false);
  };

  const copyToClipboard = (value) => {
    navigator.clipboard.writeText(value);

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
      width={newWalletModalWidth}
    >
      <ModalContainer>
        <ModalTitle>New Wallet</ModalTitle>
        <ModalContent>
          <ModalLabel>Mnemonic</ModalLabel>
          <ModalInput>
            <CopyIcon onClick={() => copyToClipboard(mnemonic)} />
            <MnemonicContainter>
              {mnemonic.split(" ").map((data, index) => (
                <Mnemonic key={index}>{data}</Mnemonic>
              ))}
            </MnemonicContainter>
          </ModalInput>

          <ModalLabel>Private Key</ModalLabel>
          <ModalInput>
            <CopyIcon onClick={() => copyToClipboard(privateKey)} />
            {privateKey}
          </ModalInput>

          <ModalLabel>Address</ModalLabel>
          <ModalInput>{address}</ModalInput>

          <NextButton onClick={() => openConfirmModal()}>NEXT</NextButton>
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
};

export default NewWalletModal;
