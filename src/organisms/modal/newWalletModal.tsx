import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";

import useFirma from "../../utils/wallet";
import { copyToClipboard, isValidString } from "../../utils/common";
import { rootState } from "../../redux/reducers";
import { Modal } from "../../components/modal";
import { modalActions } from "../../redux/action";

import Password from "./password";

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
  const newWalletModalState = useSelector((state: rootState) => state.modal.newWallet);
  const { enqueueSnackbar } = useSnackbar();
  const { getNewMnemonic } = useFirma();

  const [mnemonic, setMnemonic] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (newWalletModalState) {
      getNewMnemonic().then((mnemonic) => {
        setMnemonic(mnemonic);
      });
    }
  }, [newWalletModalState]); // eslint-disable-line react-hooks/exhaustive-deps

  const closeNewWalletModal = () => {
    closeModal();
  };

  const openConfirmModal = () => {
    if (password !== "") {
      closeModal();
      modalActions.handleModalData({ mnemonic, password });
      modalActions.handleModalConfirmWallet(true);
    } else {
      enqueueSnackbar("Incorrect Password", {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
  };

  const prevModal = () => {
    closeNewWalletModal();
    modalActions.handleModalLogin(true);
  };

  const closeModal = () => {
    modalActions.handleModalNewWallet(false);
  };

  const clipboard = (value: string) => {
    if (value === "") return;

    copyToClipboard(value);

    enqueueSnackbar("Copied", {
      variant: "success",
      autoHideDuration: 1000,
    });
  };

  const onChangePassword = (password: string) => {
    setPassword(password);
  };

  const onKeyDownPassword = () => {
    openConfirmModal();
  };

  return (
    <Modal
      visible={newWalletModalState}
      closable={true}
      onClose={closeNewWalletModal}
      prev={prevModal}
      width={newWalletModalWidth}
    >
      <ModalContainer>
        <ModalTitle>NEW WALLET</ModalTitle>
        <ModalContent>
          <ModalLabel>Mnemonic</ModalLabel>
          <ModalInput>
            <CopyIcon onClick={() => clipboard(mnemonic)} />
            <MnemonicContainter>
              {mnemonic !== "" && mnemonic.split(" ").map((data, index) => <Mnemonic key={index}>{data}</Mnemonic>)}
            </MnemonicContainter>
          </ModalInput>

          <Password onChange={onChangePassword} onKeyDown={onKeyDownPassword} />

          <NextButton onClick={() => openConfirmModal()} active={isValidString(password)}>
            Next
          </NextButton>
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
};

export default React.memo(NewWalletModal);
