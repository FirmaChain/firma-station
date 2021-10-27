import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import numeral from "numeral";
import useFirma from "utils/wallet";

import { Modal } from "components/modal";
import { modalActions } from "redux/action";

import {
  sendModalWidth,
  ModalContainer,
  ModalTitle,
  ModalContent,
  ModalLabel,
  ModalInput,
  NextButton,
  InputBoxDefault,
} from "./styles";

const SendModal = () => {
  const sendModalState = useSelector((state) => state.modal.send);
  const { balance } = useSelector((state) => state.wallet);

  const { sendFCT } = useFirma();

  const [amount, setAmount] = useState("");
  const [targetAddress, setTargetAddress] = useState("");
  const [memo, setMemo] = useState("");
  const [isActiveButton, setActiveButton] = useState(false);

  const closeModal = () => {
    resetModal();
    modalActions.handleModalSend(false);
  };

  const resetModal = () => {
    setAmount("");
  };

  useEffect(() => {
    checkParams();
  }, [amount, targetAddress, memo]);

  const onChangeAmount = (e) => {
    const { value } = e.target;
    const amount = value.replace(/[^0-9.]/g, "");

    setAmount(amount);
  };

  const onChangeTargetAddress = (e) => {
    const { value } = e.target;
    const address = value.replace(/ /g, "");

    setTargetAddress(address);
  };

  const onChangeMemo = (e) => {
    const { value } = e.target;

    setMemo(value);
  };

  const checkParams = () => {
    setActiveButton(targetAddress !== "" && amount !== "" && amount <= numeral(balance).value());
  };

  const sendTx = (resolveTx, rejectTx) => {
    sendFCT(targetAddress, amount, memo)
      .then(() => {
        resolveTx();
      })
      .catch(() => {
        rejectTx();
      });
  };

  const nextStep = () => {
    modalActions.handleModalData({
      action: "Send",
      data: { amount },
      prevModalAction: modalActions.handleModalSend,
      txAction: sendTx,
    });

    closeModal();
    modalActions.handleModalConfirmTx(true);
  };

  return (
    <Modal visible={sendModalState} closable={true} onClose={closeModal} width={sendModalWidth}>
      <ModalContainer>
        <ModalTitle>Send</ModalTitle>
        <ModalContent>
          <ModalLabel>Send To</ModalLabel>
          <ModalInput>
            <InputBoxDefault
              type="text"
              placeholder="Wallet Address"
              value={targetAddress}
              onChange={onChangeTargetAddress}
            />
          </ModalInput>

          <ModalLabel>Available</ModalLabel>
          <ModalInput>{balance} FCT</ModalInput>

          <ModalLabel>Amount</ModalLabel>
          <ModalInput>
            <InputBoxDefault type="text" placeholder="0" value={amount} onChange={onChangeAmount} />
          </ModalInput>

          <ModalLabel>Memo (optional)</ModalLabel>
          <ModalInput>
            <InputBoxDefault type="text" placeholder="" value={memo} onChange={onChangeMemo} />
          </ModalInput>
          <NextButton
            onClick={() => {
              if (isActiveButton) nextStep();
            }}
            active={isActiveButton}
          >
            NEXT
          </NextButton>
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
};

export default SendModal;
