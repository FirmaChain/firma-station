import React from "react";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";

import { Modal } from "components/modal";
import { modalActions } from "redux/action";

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
  const newWalletModalState = useSelector((state) => state.modal.newWalletModal);
  const { enqueueSnackbar } = useSnackbar();

  const closeNewWalletModal = () => {
    modalActions.handleNewWalletModal(false);
  };

  const prevModal = async () => {
    closeNewWalletModal();
    modalActions.handleLoginModal(true);
  };

  return (
    <Modal
      visible={newWalletModalState}
      closable={true}
      maskClosable={true}
      onClose={closeNewWalletModal}
      prev={prevModal}
      width={"600px"}
    >
      <ModalContainer>
        <ModalTitle>New Wallet</ModalTitle>
        <ModalContent>
          <ModalLabel>Mnemonic</ModalLabel>
          <ModalInput>
            <CopyIcon
              onClick={() => {
                enqueueSnackbar("Copied", {
                  variant: "success",
                  autoHideDuration: 1000,
                });
              }}
            />
            <MnemonicContainter>
              {/* {sampleMnemonic.map((data, index) => ( */}
              <Mnemonic>{"TEST"}</Mnemonic>
              {/* ))} */}
            </MnemonicContainter>
          </ModalInput>

          <ModalLabel>Private Key</ModalLabel>
          <ModalInput>0x13a408e48871ccde7c587f7e7dc2e7e62f772025fa47bc611c321fe75f3a7c9f</ModalInput>

          <ModalLabel>Address</ModalLabel>
          <ModalInput>firma10mncyt5t9e2l8zavssfdqyvs0uw4wu069fpuew</ModalInput>

          <NextButton onClick={() => closeNewWalletModal()}>Next</NextButton>
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
}

export default NewWalletModal;
