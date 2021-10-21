import React, { useState } from "react";
import { useSelector } from "react-redux";
import numeral from "numeral";

import { Modal } from "components/modal";
import { modalActions } from "redux/action";

import useFirma from "utils/wallet";

import {
  ModalContainer,
  ModalTitle,
  ModalContent,
  ModalLabel,
  ModalInput,
  NextButton,
  InputBoxDefault,
} from "./styles";

const DelegateModal = () => {
  const delegateModalState = useSelector((state) => state.modal.delegate);
  const modalData = useSelector((state) => state.modal.data);
  const { balance } = useSelector((state) => state.wallet);

  const { delegate } = useFirma();

  const [amount, setAmount] = useState("");
  const [isActiveButton, setActiveButton] = useState(false);

  const closeModal = () => {
    resetModal();
    modalActions.handleModalDelegate(false);
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

  const delegateTx = (resolveTx, rejectTx) => {
    delegate(modalData.data.targetValidator, amount)
      .then(() => {
        resolveTx();
      })
      .catch(() => {
        rejectTx();
      });
  };

  const nextStep = () => {
    modalActions.handleModalData({
      action: "Delegate",
      data: { amount },
      prevModalAction: modalActions.handleModalDelegate,
      txAction: delegateTx,
    });

    closeModal();
    modalActions.handleModalConfirmTx(true);
  };

  return (
    <Modal visible={delegateModalState} closable={true} onClose={closeModal} width={"500px"}>
      <ModalContainer>
        <ModalTitle>Delegate</ModalTitle>
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

export default DelegateModal;
