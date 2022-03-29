import React from "react";
import numeral from "numeral";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";

import useFirma from "../../../utils/wallet";
import { rootState } from "../../../redux/reducers";
import { ITargetStakingState, IValidatorsState } from "../hooks";
import { convertNumber, convertToFctNumber, getFeesFromGas } from "../../../utils/common";
import { modalActions } from "../../../redux/action";

import { CardWrapper, InnerWrapper, Title, Content, Buttons, Button } from "./styles";
import { FIRMACHAIN_CONFIG } from "../../../config";

interface IProps {
  targetStakingState: ITargetStakingState;
  validatorsState: IValidatorsState;
}

const DENOM = "FCT";

const DelegationCard = ({ targetStakingState, validatorsState }: IProps) => {
  const targetValidator = window.location.pathname.replace("/staking/validators/", "");
  const { balance } = useSelector((state: rootState) => state.user);
  const { isLedger } = useSelector((state: rootState) => state.wallet);
  const {
    getDelegationList,
    getDelegation,
    withdraw,
    getGasEstimationWithdraw,
    getRedelegationList,
    getUndelegationList,
  } = useFirma();

  const { enqueueSnackbar } = useSnackbar();

  const delegateAction = () => {
    if (targetStakingState.available > convertToFctNumber(FIRMACHAIN_CONFIG.defaultFee)) {
      modalActions.handleModalData({
        action: "Delegate",
        data: { targetValidator, available: targetStakingState.available },
      });

      modalActions.handleModalDelegate(true);
    } else {
      enqueueSnackbar("The fee is insufficient. Please check the balance.", {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
  };

  const redelegateAction = () => {
    getRedelegationList()
      .then((redelegationList) => {
        // if (redelegationList.length >= 7) {
        //   enqueueSnackbar("You cannot redelegate more than 7 times!", {
        //     variant: "error",
        //     autoHideDuration: 2000,
        //   });
        //   return;
        // }

        getDelegationList()
          .then((delegationList) => {
            if (delegationList && delegationList.filter((v) => v.value !== targetValidator).length === 0) {
              enqueueSnackbar("There is no target that has been delegated", {
                variant: "error",
                autoHideDuration: 2000,
              });
              return;
            }

            if (delegationList !== undefined) {
              for (let i = 0; i < delegationList.length; i++) {
                delegationList[i].label = getMoniker(delegationList[i].value);
              }
            }

            modalActions.handleModalData({
              action: "Redelegate",
              data: { targetValidator, delegationList },
            });

            modalActions.handleModalRedelegate(true);
          })
          .catch((e) => {});
      })
      .catch((e) => {});
  };

  const getMoniker = (validatorAddress: string) => {
    let moniker = validatorAddress;

    for (let i = 0; i < validatorsState.validators.length; i++) {
      if (validatorsState.validators[i].validatorAddress === validatorAddress)
        moniker = validatorsState.validators[i].validatorMoniker;
    }

    return moniker;
  };

  const undelegateAction = () => {
    getUndelegationList()
      .then((undelegationList) => {
        if (undelegationList.filter((v) => v.validatorAddress === targetValidator).length >= 7) {
          enqueueSnackbar("You cannot undelegate more than 7 times per validator!", {
            variant: "error",
            autoHideDuration: 2000,
          });
          return;
        }
        getDelegation(targetValidator)
          .then((delegation) => {
            if (delegation === undefined) {
              enqueueSnackbar("There is no target that has been delegated", {
                variant: "error",
                autoHideDuration: 2000,
              });
              return;
            }

            if (targetStakingState.available > convertToFctNumber(FIRMACHAIN_CONFIG.defaultFee)) {
              modalActions.handleModalData({
                action: "Undelegate",
                data: { targetValidator, delegation },
              });

              modalActions.handleModalUndelegate(true);
            } else {
              enqueueSnackbar("The fee is insufficient. Please check the balance.", {
                variant: "error",
                autoHideDuration: 2000,
              });
            }
          })
          .catch((e) => {});
      })
      .catch((e) => {});
  };

  const withdrawAction = () => {
    if (isLedger) modalActions.handleModalGasEstimation(true);

    getGasEstimationWithdraw(targetValidator)
      .then((gas) => {
        if (isLedger) modalActions.handleModalGasEstimation(false);

        if (convertNumber(balance) > convertToFctNumber(getFeesFromGas(gas))) {
          modalActions.handleModalData({
            action: "Withdraw",
            data: { amount: targetStakingState.stakingReward, fees: getFeesFromGas(gas), gas },
            txAction: withdrawTx,
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

  const withdrawTx = (resolveTx: () => void, rejectTx: () => void, gas = 0) => {
    withdraw(targetValidator, gas)
      .then(() => {
        resolveTx();
      })
      .catch(() => {
        rejectTx();
      });
  };

  return (
    <CardWrapper>
      <InnerWrapper>
        <Title>My Delegations</Title>
        <Content>{`${numeral(targetStakingState.delegated).format("0,0.000")} ${DENOM}`}</Content>
        <Buttons>
          <Button onClick={delegateAction} isActive={true}>
            Delegate
          </Button>
          <Button onClick={redelegateAction} isActive={true}>
            Redelegate
          </Button>
          <Button
            onClick={() => {
              if (targetStakingState.delegated > 0) undelegateAction();
            }}
            isActive={targetStakingState.delegated > 0}
          >
            Undelegate
          </Button>
        </Buttons>
      </InnerWrapper>
      <InnerWrapper>
        <Title>Rewards</Title>
        <Content>{`${numeral(targetStakingState.stakingReward).format("0,0.000")} ${DENOM}`}</Content>
        <Buttons>
          <Button
            onClick={() => {
              if (targetStakingState.stakingReward > 0) withdrawAction();
            }}
            isActive={targetStakingState.stakingReward > 0}
          >
            Withdraw
          </Button>
        </Buttons>
      </InnerWrapper>
    </CardWrapper>
  );
};

export default React.memo(DelegationCard);
