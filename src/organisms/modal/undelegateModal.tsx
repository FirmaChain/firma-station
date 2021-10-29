import React, { useState } from "react";
import numeral from "numeral";
import { useSelector } from "react-redux";

import useFirma from "../../utils/wallet";
import { useApolloClient } from "@apollo/client";
import { rootState } from "../../redux/reducers";
import { convertNumber, convertToFctNumber, isValid } from "../../utils/common";
import { Modal } from "../../components/modal";
import { modalActions } from "../../redux/action";

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
  const undelegateModalState = useSelector((state: rootState) => state.modal.undelegate);
  const modalData = useSelector((state: rootState) => state.modal.data);

  const { undelegate } = useFirma();
  const { reFetchObservableQueries } = useApolloClient();

  const [amount, setAmount] = useState("");
  const [isActiveButton, setActiveButton] = useState(false);

  const closeModal = () => {
    resetModal();
    modalActions.handleModalUndelegate(false);
  };

  const resetModal = () => {
    setAmount("");
  };

  const onChangeAmount = (e: any) => {
    const { value } = e.target;
    const amount = value.replace(/[^0-9.]/g, "");

    setAmount(amount);
    setActiveButton(amount > 0 && amount <= convertToFctNumber(modalData.data.delegation.amount));
  };

  const undelegateTx = (resolveTx: () => void, rejectTx: () => void) => {
    undelegate(modalData.data.targetValidator, convertNumber(amount))
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
            {isValid(modalData.data)
              ? numeral(convertToFctNumber(modalData.data.delegation.amount)).format("0,0.000")
              : 0}{" "}
            FCT
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

export default React.memo(UndelegateModal);
