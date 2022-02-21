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

interface IProps {
  targetStakingState: ITargetStakingState;
  validatorsState: IValidatorsState;
}

const DENOM = "FCT";

const DelegationCard = ({ targetStakingState, validatorsState }: IProps) => {
  const targetValidator = window.location.pathname.replace("/staking/validators/", "");
  const { balance } = useSelector((state: rootState) => state.user);
  const { isLedger } = useSelector((state: rootState) => state.wallet);
  const { getDelegationList, getDelegation, withdraw, getGasEstimationWithdraw } = useFirma();
  const { enqueueSnackbar } = useSnackbar();

  const delegateAction = () => {
    modalActions.handleModalData({
      action: "Delegate",
      data: { targetValidator, available: targetStakingState.available },
    });

    modalActions.handleModalDelegate(true);
  };

  const redelegateAction = () => {
    getDelegationList()
      .then((delegationList) => {
        if (delegationList && delegationList.length === 0) {
          enqueueSnackbar("There is no target that has been delegated", {
            variant: "error",
            autoHideDuration: 1000,
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
    getDelegation(targetValidator)
      .then((delegation) => {
        if (delegation === undefined) {
          enqueueSnackbar("There is no target that has been delegated", {
            variant: "error",
            autoHideDuration: 1000,
          });
          return;
        }

        modalActions.handleModalData({
          action: "Undelegate",
          data: { targetValidator, delegation },
        });

        modalActions.handleModalUndelegate(true);
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
