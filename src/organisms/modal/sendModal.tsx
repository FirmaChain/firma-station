import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import useFirma from "../../utils/wallet";
import { useApolloClient } from "@apollo/client";
import { rootState } from "../../redux/reducers";
import { Modal } from "../../components/modal";
import { modalActions } from "../../redux/action";

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
import { convertNumber } from "../../utils/common";

const SendModal = () => {
  const sendModalState = useSelector((state: rootState) => state.modal.send);
  //TODO : BALANCE
  // const { balance } = useSelector((state: rootState) => state.wallet);
  const balance = 0;
  const { sendFCT } = useFirma();
  const { reFetchObservableQueries } = useApolloClient();

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

  const onChangeAmount = (e: any) => {
    const { value } = e.target;
    const amount = value.replace(/[^0-9.]/g, "");

    setAmount(amount);
  };

  const onChangeTargetAddress = (e: any) => {
    const { value } = e.target;
    const address = value.replace(/ /g, "");

    setTargetAddress(address);
  };

  const onChangeMemo = (e: any) => {
    const { value } = e.target;

    setMemo(value);
  };

  const checkParams = () => {
    setActiveButton(targetAddress !== "" && amount !== "" && convertNumber(amount) <= convertNumber(balance));
  };

  const sendTx = (resolveTx: () => void, rejectTx: () => void) => {
    sendFCT(targetAddress, amount, memo)
      .then(() => {
        reFetchObservableQueries();
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

export default React.memo(SendModal);
