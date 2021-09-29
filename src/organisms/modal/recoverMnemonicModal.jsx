import React from "react";
import { useSelector } from "react-redux";

import { Modal } from "components/modal";
import { modalActions } from "redux/action";

import {
  ModalContainer,
  ModalTitle,
  ModalContent,
  ModalLabel,
  ModalInput,
  MnemonicTextArea,
  NextButton,
} from "./styles";

function RecoverMnemonicModal() {
  const recoverMnemonicModalState = useSelector((state) => state.modal.recoverMnemonic);
  const { mnemonic, privateKey, address } = useSelector((state) => state.wallet);
  // const { generateWallet } = useFirma();

  const closeRecoverMnemonicModal = () => {
    modalActions.handleModalRecoverMnemonic(false);
  };

  const prevModal = () => {
    closeRecoverMnemonicModal();
    modalActions.handleModalLogin(true);
  };

  return (
    <Modal
      visible={recoverMnemonicModalState}
      closable={true}
      maskClosable={true}
      onClose={closeRecoverMnemonicModal}
      prev={prevModal}
      width={"600px"}
    >
      <ModalContainer>
        <ModalTitle>Recover from Mnemonic</ModalTitle>
        <ModalContent>
          <ModalLabel>Mnemonic</ModalLabel>
          <ModalInput>
            <MnemonicTextArea />
          </ModalInput>
          <NextButton onClick={() => closeRecoverMnemonicModal()}>Recover</NextButton>
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
}

export default RecoverMnemonicModal;
