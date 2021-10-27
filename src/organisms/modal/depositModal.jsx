import React, { useState } from "react";
import numeral from "numeral";
import { useSelector } from "react-redux";
import useFirma from "utils/wallet";

import { Modal } from "components/modal";
import { modalActions } from "redux/action";

import {
  depositModalWidth,
  ModalContainer,
  ModalTitle,
  ModalContent,
  ModalLabel,
  ModalInput,
  NextButton,
  InputBoxDefault,
} from "./styles";

const DepositModal = () => {
  const depositModalState = useSelector((state) => state.modal.deposit);
  const modalData = useSelector((state) => state.modal.data);
  const { balance } = useSelector((state) => state.wallet);

  const { deposit } = useFirma();

  const [amount, setAmount] = useState("");
  const [isActiveButton, setActiveButton] = useState(false);

  const closeModal = () => {
    resetModal();
    modalActions.handleModalDeposit(false);
  };

  const resetModal = () => {
    setAmount("");
  };

  const onChangeAmount = (e) => {
    const { value } = e.target;
    const amount = value.replace(/[^0-9.]/g, "");

    setAmount(amount);
    setActiveButton(amount > 0 && amount <= numeral(balance).value());
  };

  const depositTx = (resolveTx, rejectTx) => {
    deposit(modalData.proposalId, amount)
      .then(() => {
        resolveTx();
      })
      .catch(() => {
        rejectTx();
      });
  };

  const nextStep = () => {
    modalActions.handleModalData({
      action: "Deposit",
      data: { amount },
      prevModalAction: modalActions.handleModalDeposit,
      txAction: depositTx,
    });

    closeModal();
    modalActions.handleModalConfirmTx(true);
  };

  return (
    <Modal visible={depositModalState} closable={true} onClose={closeModal} width={depositModalWidth}>
      <ModalContainer>
        <ModalTitle>Deposit</ModalTitle>
        <ModalContent>
          <ModalLabel>Available</ModalLabel>
          <ModalInput>{balance} FCT</ModalInput>

          <ModalLabel>Amount</ModalLabel>
          <ModalInput>
            <InputBoxDefault type="text" placeholder="0" value={amount} onChange={onChangeAmount} />
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

export default DepositModal;
