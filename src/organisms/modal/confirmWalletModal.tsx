import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";

import useFirma from "../../utils/wallet";
import { rootState } from "../../redux/reducers";
import { Modal } from "../../components/modal";
import { modalActions } from "../../redux/action";

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

interface IInputTarget {
  index: number;
  mnemonic: string;
  text: string;
}

const ConfirmWalletModal = () => {
  const confirmWalletModalState = useSelector((state: rootState) => state.modal.confirmWallet);
  const { mnemonic, password } = useSelector((state: rootState) => state.modal.data);
  const { enqueueSnackbar } = useSnackbar();
  const { storeWalletFromMnemonic } = useFirma();

  const [inputTarget, setInputTarget] = useState<Array<IInputTarget>>([]);
  const [selectTarget, setSelectTarget] = useState<Array<string>>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [isActiveCreateButton, activeCreateButton] = useState<boolean>(false);

  useEffect(() => {
    if (confirmWalletModalState) {
      let mnemonicArray = mnemonic.split(" ").map((mnemonicWord: string, index: number) => {
        return {
          index,
          mnemonic: mnemonicWord,
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
    closeModal();
  };

  const confirmWallet = () => {
    storeWalletFromMnemonic(password, mnemonic).then(() => {
      enqueueSnackbar("Success Create Wallet", {
        variant: "success",
        autoHideDuration: 1000,
      });
      closeModal();
    });
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
    modalActions.handleModalData({});
  };

  const putWord = (mnemonic: string) => {
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

  const getIndexText = (index: number) => {
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

  const shuffleArray = (array: Array<string>) => {
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
            isActive={isActiveCreateButton}
          >
            CREATE
          </CreateButton>
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
};

export default React.memo(ConfirmWalletModal);
