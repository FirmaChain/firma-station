import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";

import useFirma from "../../utils/wallet";
import { useApolloClient } from "@apollo/client";
import { convertNumber, convertToFctNumber, convertToFctString, getFeesFromGas } from "../../utils/common";
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
  const { isLedger } = useSelector((state: rootState) => state.wallet);
  const { enqueueSnackbar } = useSnackbar();

  const { delegate, getGasEstimationDelegate } = useFirma();
  const { reFetchObservableQueries } = useApolloClient();

  const [amount, setAmount] = useState("");
  const [isActiveButton, setActiveButton] = useState(false);
  const [availableAmount, setAvailableAmount] = useState("");

  useEffect(() => {
    setAvailableAmount(modalData.data.available);
  }, [delegateModalState]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const delegateTx = (resolveTx: () => void, rejectTx: () => void, gas = 0) => {
    delegate(modalData.data.targetValidator, convertNumber(amount), gas)
      .then(() => {
        reFetchObservableQueries();
        resolveTx();
      })
      .catch(() => {
        rejectTx();
      });
  };

  const nextStep = () => {
    if (isLedger) modalActions.handleModalGasEstimation(true);

    closeModal();

    getGasEstimationDelegate(modalData.data.targetValidator, convertNumber(amount))
      .then((gas) => {
        if (isLedger) modalActions.handleModalGasEstimation(false);

        modalActions.handleModalData({
          action: "Delegate",
          data: { amount, fees: getFeesFromGas(gas), gas },
          prevModalAction: modalActions.handleModalDelegate,
          txAction: delegateTx,
        });

        modalActions.handleModalConfirmTx(true);
      })
      .catch(() => {
        if (isLedger) {
          enqueueSnackbar("Gas estimate failed. Please check your ledger.", {
            variant: "error",
            autoHideDuration: 3000,
          });
          modalActions.handleModalGasEstimation(false);
        }
      });
  };

  return (
    <Modal visible={delegateModalState} closable={true} onClose={closeModal} width={delegateModalWidth}>
      <ModalContainer>
        <ModalTitle>DELEGATE</ModalTitle>
        <ModalContent>
          <ModalLabel>Available</ModalLabel>
          <ModalInput>{availableAmount} FCT</ModalInput>

          <ModalLabel>Fee estimation</ModalLabel>
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
