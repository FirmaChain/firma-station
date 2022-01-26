import React, { useState, useEffect } from "react";
import numeral from "numeral";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";

import useFirma from "../../utils/wallet";
import { useApolloClient } from "@apollo/client";
import { rootState } from "../../redux/reducers";
import { convertNumber, convertToFctNumber, convertToFctString, getFeesFromGas, isValid } from "../../utils/common";
import { Modal } from "../../components/modal";
import { modalActions } from "../../redux/action";
import { FIRMACHAIN_CONFIG } from "../../config";

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
  const { balance } = useSelector((state: rootState) => state.user);
  const { isLedger } = useSelector((state: rootState) => state.wallet);
  const { enqueueSnackbar } = useSnackbar();
  const { undelegate, getGasEstimationUndelegate } = useFirma();
  const { reFetchObservableQueries } = useApolloClient();

  const [amount, setAmount] = useState("");
  const [isActiveButton, setActiveButton] = useState(false);

  const [availableAmount, setAvailableAmount] = useState("");

  useEffect(() => {
    setAvailableAmount(
      isValid(modalData.data) ? numeral(convertToFctNumber(modalData.data.delegation.amount)).format("0,0.000") : "0"
    );
  }, [undelegateModalState]); // eslint-disable-line react-hooks/exhaustive-deps

  const closeModal = () => {
    resetModal();
    modalActions.handleModalUndelegate(false);
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
    setActiveButton(
      convertNumber(amount) > 0 && convertNumber(amount) <= convertToFctNumber(modalData.data.delegation.amount)
    );
  };

  const getMaxAmount = () => {
    return convertToFctNumber(modalData.data.delegation.amount);
  };

  const undelegateTx = (resolveTx: () => void, rejectTx: () => void, gas = 0) => {
    undelegate(modalData.data.targetValidator, convertNumber(amount), gas)
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

    getGasEstimationUndelegate(modalData.data.targetValidator, convertNumber(amount))
      .then((gas) => {
        if (isLedger) modalActions.handleModalGasEstimation(false);

        if (convertNumber(balance) > convertToFctNumber(gas)) {
          modalActions.handleModalData({
            action: "Undelegate",
            data: { amount: amount, fees: getFeesFromGas(gas), gas },
            prevModalAction: modalActions.handleModalUndelegate,
            txAction: undelegateTx,
          });

          modalActions.handleModalConfirmTx(true);
        } else {
          enqueueSnackbar("Insufficient funds. Please check your account balance.", {
            variant: "error",
            autoHideDuration: 2000,
          });
        }
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
    <Modal visible={undelegateModalState} closable={true} onClose={closeModal} width={undelegateModalWidth}>
      <ModalContainer>
        <ModalTitle>UNDELEGATE</ModalTitle>
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

export default React.memo(UndelegateModal);
