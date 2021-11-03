import React, { useState } from "react";
import { useSelector } from "react-redux";

import useFirma from "../../utils/wallet";
import { useApolloClient } from "@apollo/client";
import { convertNumber } from "../../utils/common";
import { rootState } from "../../redux/reducers";
import { Modal } from "../../components/modal";
import { modalActions } from "../../redux/action";

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
  const depositModalState = useSelector((state: rootState) => state.modal.deposit);
  const modalData = useSelector((state: rootState) => state.modal.data);
  //TODO : BALANCE
  // const { balance } = useSelector((state: rootState) => state.wallet);
  const balance = 0;

  const { deposit } = useFirma();
  const { reFetchObservableQueries } = useApolloClient();

  const [amount, setAmount] = useState("");
  const [isActiveButton, setActiveButton] = useState(false);

  const closeModal = () => {
    resetModal();
    modalActions.handleModalDeposit(false);
  };

  const resetModal = () => {
    setAmount("");
  };

  const onChangeAmount = (e: any) => {
    const { value } = e.target;
    const amount = value.replace(/[^0-9.]/g, "");

    setAmount(amount);
    setActiveButton(amount > 0 && amount <= convertNumber(balance));
  };

  const depositTx = (resolveTx: () => void, rejectTx: () => void) => {
    deposit(modalData.proposalId, convertNumber(amount))
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

export default React.memo(DepositModal);
