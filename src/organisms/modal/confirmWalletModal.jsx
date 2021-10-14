import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";

import { Modal } from "components/modal";
import { modalActions } from "redux/action";

import {
  confirmWalletModalWidth,
  ModalContainer,
  ModalTitle,
  ModalContent,
  ModalLabel,
  ModalInput,
  InputContainer,
  InputWrapper,
  InputBox,
  SelectContainer,
  SelectMnemonic,
  CreateButton,
} from "./styles";

import useFirma from "utils/wallet";

const ConfirmWalletModal = () => {
  const confirmWalletModalState = useSelector((state) => state.modal.confirmWallet);
  const { mnemonic } = useSelector((state) => state.wallet);
  const { enqueueSnackbar } = useSnackbar();
  const { resetWallet, initWallet } = useFirma();

  const [inputTarget, setInputTarget] = useState([]);
  const [selectTarget, setSelectTarget] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isActiveCreateButton, activeCreateButton] = useState(false);

  useEffect(() => {
    if (confirmWalletModalState) {
      let mnemonicArray = mnemonic.split(" ").map((mnemonic, index) => {
        return {
          index,
          mnemonic,
        };
      });
      let inputTargetList = [];
      let selectTargetList = [];

      for (let i = 0; i < 2; i++) {
        const randomIndex = Math.floor(Math.random() * mnemonicArray.length);
        inputTargetList.push({
          index: mnemonicArray[randomIndex].index,
          mnemonic: mnemonicArray[randomIndex].mnemonic,
          text: "",
        });
        selectTargetList.push(mnemonicArray[randomIndex].mnemonic);
        mnemonicArray.splice(randomIndex, 1);
      }

      for (let i = 0; i < 4; i++) {
        const randomIndex = Math.floor(Math.random() * mnemonicArray.length);
        selectTargetList.push(mnemonicArray[randomIndex].mnemonic);
        mnemonicArray.splice(randomIndex, 1);
      }

      selectTargetList = shuffleArray(selectTargetList);

      setInputTarget(inputTargetList);
      setSelectTarget(selectTargetList);
    }
  }, [confirmWalletModalState]);

  const cancelWallet = () => {
    resetWallet();
    closeModal();
  };

  const confirmWallet = () => {
    enqueueSnackbar("Success Create Wallet", {
      variant: "success",
      autoHideDuration: 1000,
    });
    initWallet();
    closeModal();
  };

  const prevModal = () => {
    cancelWallet();
    modalActions.handleModalLogin(true);
  };

  const closeModal = () => {
    setInputTarget([]);
    setSelectTarget([]);
    setCurrentWordIndex(0);
    activeCreateButton(false);
    modalActions.handleModalConfirmWallet(false);
  };

  const putWord = (mnemonic) => {
    let newInputTarget = [...inputTarget];
    newInputTarget[currentWordIndex].text = mnemonic;

    setInputTarget(newInputTarget);
    setCurrentWordIndex(currentWordIndex === 0 ? 1 : 0);

    checkWord();
  };

  const checkWord = () => {
    activeCreateButton(
      inputTarget[0].text === inputTarget[0].mnemonic && inputTarget[1].text === inputTarget[1].mnemonic
    );
  };

  const getIndexText = (index) => {
    switch (index + 1) {
      case 1:
        return index + 1 + "st";
      case 2:
        return index + 1 + "nd";
      case 3:
        return index + 1 + "rd";
      default:
        return index + 1 + "th";
    }
  };

  const shuffleArray = (array) => {
    for (let i = 0; i < array.length; i++) {
      let j = Math.floor(Math.random() * (i + 1));
      const x = array[i];
      array[i] = array[j];
      array[j] = x;
    }
    return array;
  };

  return (
    <Modal
      visible={confirmWalletModalState}
      closable={true}
      maskClosable={true}
      onClose={cancelWallet}
      prev={prevModal}
      width={confirmWalletModalWidth}
    >
      <ModalContainer>
        <ModalTitle>Confirm Wallet</ModalTitle>
        <ModalContent>
          <InputContainer>
            {inputTarget.map((data, index) => (
              <InputWrapper key={index}>
                <ModalLabel>{getIndexText(data.index)} Word</ModalLabel>
                <ModalInput>
                  <InputBox active={index === currentWordIndex}>{data.text}</InputBox>
                </ModalInput>
              </InputWrapper>
            ))}
          </InputContainer>
          <SelectContainer>
            {selectTarget.map((mnemonic, index) => (
              <SelectMnemonic key={index} onClick={() => putWord(mnemonic)}>
                {mnemonic}
              </SelectMnemonic>
            ))}
          </SelectContainer>
          <CreateButton
            onClick={() => {
              if (isActiveCreateButton) confirmWallet();
            }}
            active={isActiveCreateButton}
          >
            CREATE
          </CreateButton>
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
};

export default ConfirmWalletModal;
