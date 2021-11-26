import React from "react";
import numeral from "numeral";
import { useSnackbar } from "notistack";

import useFirma from "../../../utils/wallet";
import { ITargetStakingState } from "../hooks";
import { modalActions } from "../../../redux/action";

import { CardWrapper, InnerWrapper, Title, Content, Buttons, Button } from "./styles";

interface IProps {
  targetStakingState: ITargetStakingState;
}

const DENOM = "FCT";

const DelegationCard = ({ targetStakingState }: IProps) => {
  const targetValidator = window.location.pathname.replace("/staking/validators/", "");
  const { getDelegationList, getDelegation, withdraw } = useFirma();
  const { enqueueSnackbar } = useSnackbar();

  const delegateAction = () => {
    modalActions.handleModalData({
      action: "Delegate",
      data: { targetValidator },
    });

    modalActions.handleModalDelegate(true);
  };

  const redelegateAction = async () => {
    const delegationList = await getDelegationList();

    if (delegationList && delegationList.length === 0) {
      enqueueSnackbar("There is no target that has been delegated", {
        variant: "error",
        autoHideDuration: 1000,
      });
      return;
    }

    modalActions.handleModalData({
      action: "Redelegate",
      data: { targetValidator, delegationList },
    });

    modalActions.handleModalRedelegate(true);
  };

  const undelegateAction = async () => {
    const delegation = await getDelegation(targetValidator);

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
  };

  const withdrawAction = () => {
    modalActions.handleModalData({
      action: "Withdraw",
      data: { amount: targetStakingState.stakingReward },
      txAction: withdrawTx,
    });

    modalActions.handleModalConfirmTx(true);
  };

  const withdrawTx = (resolveTx: () => void, rejectTx: () => void) => {
    withdraw(targetValidator)
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
