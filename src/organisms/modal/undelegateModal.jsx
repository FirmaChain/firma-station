import React, { useState } from "react";
import { useSelector } from "react-redux";
import numeral from "numeral";
import useFirma from "utils/wallet";

import { isValid } from "utils/common";
import { Modal } from "components/modal";
import { modalActions } from "redux/action";

import {
  undelegateModalWidth,
  ModalContainer,
  ModalTitle,
  ModalContent,
  ModalLabel,
  ModalInput,
  NextButton,
  InputBoxDefault,
} from "./styles";

const UndelegateModal = () => {
  const undelegateModalState = useSelector((state) => state.modal.undelegate);
  const modalData = useSelector((state) => state.modal.data);

  const { undelegate } = useFirma();

  const [amount, setAmount] = useState("");
  const [isActiveButton, setActiveButton] = useState(false);

  const closeModal = () => {
    resetModal();
    modalActions.handleModalUndelegate(false);
  };

  const resetModal = () => {
    setAmount("");
  };

  const onChangeAmount = (e) => {
    const { value } = e.target;
    const amount = value.replace(/[^0-9.]/g, "");

    setAmount(amount);
    setActiveButton(amount > 0 && amount <= numeral(modalData.data.delegation.amount / 1000000).value());
  };

  const undelegateTx = (resolveTx, rejectTx) => {
    undelegate(modalData.data.targetValidator, amount)
      .then(() => {
        resolveTx();
      })
      .catch(() => {
        rejectTx();
      });
  };

  const nextStep = () => {
    modalActions.handleModalData({
      action: "Undelegate",
      data: { amount: amount },
      prevModalAction: modalActions.handleModalUndelegate,
      txAction: undelegateTx,
    });

    closeModal();
    modalActions.handleModalConfirmTx(true);
  };

  return (
    <Modal visible={undelegateModalState} closable={true} onClose={closeModal} width={undelegateModalWidth}>
      <ModalContainer>
        <ModalTitle>Undelegate</ModalTitle>
        <ModalContent>
          <ModalLabel>Available</ModalLabel>
          <ModalInput>
            {isValid(modalData.data) ? numeral(modalData.data.delegation.amount / 1000000).format("0,0.000") : 0} FCT
          </ModalInput>
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

export default UndelegateModal;
