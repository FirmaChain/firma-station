import React, { useState } from "react";
import { useSelector } from "react-redux";

import useFirma from "../../utils/wallet";
import { useApolloClient } from "@apollo/client";
import { convertNumber, convertToFctNumber, convertToFctString } from "../../utils/common";
import { rootState } from "../../redux/reducers";
import { Modal } from "../../components/modal";
import { modalActions } from "../../redux/action";
import { FIRMACHAIN_CONFIG } from "../../config";

import {
  delegateModalWidth,
  ModalContainer,
  ModalTitle,
  ModalContent,
  ModalLabel,
  ModalInput,
  NextButton,
  InputBoxDefault,
} from "./styles";

const DelegateModal = () => {
  const delegateModalState = useSelector((state: rootState) => state.modal.delegate);
  const modalData = useSelector((state: rootState) => state.modal.data);

  const { delegate } = useFirma();
  const { reFetchObservableQueries } = useApolloClient();

  const [amount, setAmount] = useState("");
  const [isActiveButton, setActiveButton] = useState(false);

  const closeModal = () => {
    resetModal();
    modalActions.handleModalDelegate(false);
  };

  const resetModal = () => {
    setAmount("");
  };

  const onChangeAmount = (e: any) => {
    const { value } = e.target;

    let amount: string = value.replace(/[^0-9.]/g, "");

    if (amount === "") {
      setAmount("");
      return;
    }

    const pattern = /(^\d+$)|(^\d{1,}.\d{0,6}$)/;

    if (!pattern.test(amount)) {
      amount = convertNumber(amount).toFixed(6);
    }

    if (convertNumber(amount) > getMaxAmount()) {
      amount = getMaxAmount().toString();
    }

    setAmount(amount);
    setActiveButton(convertNumber(amount) > 0 && convertNumber(amount) <= convertNumber(modalData.data.available));
  };

  const getMaxAmount = () => {
    const value = convertNumber(
      (modalData.data.available - convertToFctNumber(FIRMACHAIN_CONFIG.defaultFee)).toFixed(6)
    );

    return value > 0 ? value : 0;
  };

  const delegateTx = (resolveTx: () => void, rejectTx: () => void) => {
    delegate(modalData.data.targetValidator, convertNumber(amount))
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
      action: "Delegate",
      data: { amount },
      prevModalAction: modalActions.handleModalDelegate,
      txAction: delegateTx,
    });

    closeModal();
    modalActions.handleModalConfirmTx(true);
  };

  return (
    <Modal visible={delegateModalState} closable={true} onClose={closeModal} width={delegateModalWidth}>
      <ModalContainer>
        <ModalTitle>DELEGATE</ModalTitle>
        <ModalContent>
          <ModalLabel>Available</ModalLabel>
          <ModalInput>{modalData.data.available} FCT</ModalInput>

          <ModalLabel>Fees</ModalLabel>
          <ModalInput>{`${convertToFctString(FIRMACHAIN_CONFIG.defaultFee.toString())} FCT`}</ModalInput>

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
            Next
          </NextButton>
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
};

export default React.memo(DelegateModal);
