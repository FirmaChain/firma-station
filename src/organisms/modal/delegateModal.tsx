import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";

import useFirma from "../../utils/wallet";
import { convertNumber, convertToFctNumber, convertToFctString, getFeesFromGas } from "../../utils/common";
import { rootState } from "../../redux/reducers";
import { Modal } from "../../components/modal";
import { modalActions } from "../../redux/action";
import { FIRMACHAIN_CONFIG, GUIDE_LINK_DELEGATE } from "../../config";

import { ToggleButton } from "../../components/toggle";

import {
  delegateModalWidth,
  ModalContainer,
  ModalTitle,
  ModalContent,
  ModalLabel,
  ModalInput,
  NextButton,
  InputBoxDefault,
  ModalToggleWrapper,
  ModalTooltipWrapper,
  ModalTooltipIcon,
  ModalTooltipTypo,
  MaxButton,
  HelpIcon,
} from "./styles";

const DelegateModal = () => {
  const delegateModalState = useSelector((state: rootState) => state.modal.delegate);
  const modalData = useSelector((state: rootState) => state.modal.data);
  const { balance } = useSelector((state: rootState) => state.user);
  const { isLedger } = useSelector((state: rootState) => state.wallet);
  const { enqueueSnackbar } = useSnackbar();

  const { delegate, getGasEstimationDelegate, setUserData } = useFirma(false);

  const [amount, setAmount] = useState("");
  const [isActiveButton, setActiveButton] = useState(false);
  const [availableAmount, setAvailableAmount] = useState("");
  const [isSafety, setSafety] = useState(true);

  useEffect(() => {
    setAvailableAmount(modalData.data.available);
    setSafety(modalData.data.available > 0.1);
  }, [delegateModalState]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    onChangeAmount({ target: { value: amount } });
  }, [isSafety]); // eslint-disable-line react-hooks/exhaustive-deps

  const closeModal = () => {
    resetModal();
    modalActions.handleModalDelegate(false);
  };

  const resetModal = () => {
    setAmount("");
  };

  const onClickMaxAmount = () => {
    if (getMaxAmount() > 0) {
      const amount = getMaxAmount().toString();
      setAmount(amount);
      setActiveButton(convertNumber(amount) > 0 && convertNumber(amount) <= convertNumber(modalData.data.available));
    }
  };

  const onClickToggle = () => {
    if (modalData.data.available > 0.1) {
      setSafety(!isSafety);
    } else {
      setSafety(false);
    }
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
    const fee = isSafety ? 0.1 : convertToFctNumber(FIRMACHAIN_CONFIG.defaultFee);
    const value = convertNumber((modalData.data.available - fee).toFixed(6));

    return value > 0 ? value : 0;
  };

  const delegateTx = (resolveTx: () => void, rejectTx: () => void, gas = 0) => {
    delegate(modalData.data.targetValidator, convertNumber(amount), gas)
      .then(() => {
        setUserData();
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

        if (convertNumber(balance) - convertNumber(amount) >= convertToFctNumber(getFeesFromGas(gas))) {
          modalActions.handleModalData({
            action: "Delegate",
            data: { amount, fees: getFeesFromGas(gas), gas },
            prevModalAction: modalActions.handleModalDelegate,
            txAction: delegateTx,
          });

          modalActions.handleModalConfirmTx(true);
        } else {
          enqueueSnackbar("Insufficient funds. Please check your account balance.", {
            variant: "error",
            autoHideDuration: 2000,
          });
        }
      })
      .catch((e) => {
        enqueueSnackbar(e, {
          variant: "error",
          autoHideDuration: 5000,
        });
        if (isLedger) modalActions.handleModalGasEstimation(false);
      });
  };

  return (
    <Modal visible={delegateModalState} closable={true} onClose={closeModal} width={delegateModalWidth}>
      <ModalContainer>
        <ModalTitle>
          DELEGATE
          <HelpIcon onClick={() => window.open(GUIDE_LINK_DELEGATE)} />
        </ModalTitle>
        <ModalContent>
          <ModalLabel>Available</ModalLabel>
          <ModalInput>{availableAmount} FCT</ModalInput>

          <ModalLabel>Fee estimation</ModalLabel>
          <ModalInput>{`${convertToFctString(FIRMACHAIN_CONFIG.defaultFee.toString())} FCT`}</ModalInput>

          <ModalLabel>Amount</ModalLabel>
          <ModalInput style={{ marginBottom: "10px" }}>
            <MaxButton active={getMaxAmount() > 0} onClick={onClickMaxAmount}>
              Max
            </MaxButton>
            <InputBoxDefault type="text" placeholder="0" value={amount} onChange={onChangeAmount} />
          </ModalInput>

          <ModalToggleWrapper>
            <ToggleButton toggleText="Safety" isActive={isSafety} onClickToggle={onClickToggle} />
            {isSafety && (
              <ModalTooltipWrapper>
                <ModalTooltipIcon />
                <ModalTooltipTypo>
                  The entire amount is automatically entered except 0.1FCT, which will be used as a transaction fee.
                </ModalTooltipTypo>
              </ModalTooltipWrapper>
            )}
          </ModalToggleWrapper>

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
