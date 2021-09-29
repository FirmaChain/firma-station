import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";

import { Modal } from "components/modal";
import { modalActions } from "redux/action";
import { walletActions } from "redux/action";

import { ModalContainer, ModalTitle, ModalContent, ModalLabel, ModalInput, CreateButton } from "./styles";

import styled from "styled-components";

const InputContainer = styled.div`
  display: flex;
  gap: 0 20px;
  margin-bottom: 20px;
`;

const InputWrapper = styled.div`
  flex: 1;
`;

const InputBox = styled.div`
  width: calc(100% - 12px);
  height: 35px;
  padding-left: 10px;
  line-height: 35px;
  color: #777;
  background-color: #1b1c22;
  border-radius: 4px;
  cursor: pointer;
  ${(props) => (props.active ? `border: 1px solid #324ab8;` : `border: 1px solid #555;`)}
`;

const SelectContainer = styled.div`
  width: 100%;
  display: flex;
  position: relative;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const SelectMnemonic = styled.div`
  width: 32%;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border-radius: 4px;
  background-color: #3550de40;
  color: #ccc;
  margin-bottom: 10px;
  cursor: pointer;
  &:hover {
    background-color: #3550de80;
  }
`;

function ConfirmWalletModal() {
  const confirmWalletModalState = useSelector((state) => state.modal.confirmWallet);
  const { mnemonic } = useSelector((state) => state.wallet);
  const { enqueueSnackbar } = useSnackbar();

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
      console.log(mnemonicArray);
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

      console.log(inputTargetList);
      setInputTarget(inputTargetList);
      setSelectTarget(selectTargetList);
    } else {
      activeCreateButton(false);
    }
  }, [confirmWalletModalState]);

  const closeModal = () => {
    modalActions.handleModalConfirmWallet(false);
  };

  const closeConfirmWalletModal = () => {
    modalActions.handleModalConfirmWallet(false);
    walletActions.handleWalletInit(true);
  };

  const prevModal = () => {
    closeConfirmWalletModal();
    modalActions.handleModalLogin(true);
  };

  const putWord = (mnemonic) => {
    let newInputTarget = [...inputTarget];
    newInputTarget[currentWordIndex].text = mnemonic;
    setInputTarget(newInputTarget);
    setCurrentWordIndex(currentWordIndex === 0 ? 1 : 0);

    checkWord();
  };

  const checkWord = () => {
    if (inputTarget[0].text === inputTarget[0].mnemonic && inputTarget[1].text === inputTarget[1].mnemonic)
      activeCreateButton(true);
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

  return (
    <Modal
      visible={confirmWalletModalState}
      closable={true}
      maskClosable={true}
      onClose={closeModal}
      prev={prevModal}
      width={"650px"}
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
              if (isActiveCreateButton) closeConfirmWalletModal();
            }}
            active={isActiveCreateButton}
          >
            CREATE
          </CreateButton>
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
}

export default ConfirmWalletModal;
