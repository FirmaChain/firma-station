import React from "react";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import styled from "styled-components";
import numeral from "numeral";

import { modalActions } from "redux/action";
import useFirma from "utils/wallet";

const CardWrapper = styled.div`
  padding: 16px 24px;
  position: -webkit-sticky;
  position: sticky;
  top: 0px;
  background-color: #1b1c22;
  display: flex;
  justify-content: flex-start;
  gap: 0 30px;
`;

const InnerWrapper = styled.div`
  display: flex;
`;

const Title = styled.div`
  width: 140px;
  text-align: center;
  height: 35px;
  line-height: 35px;
`;

const Content = styled.div`
  width: 180px;
  text-align: left;
  height: 35px;
  line-height: 35px;
`;

const Buttons = styled.div`
  display: flex;
  gap: 0 16px;
  justify-content: center;
`;

const Button = styled.div`
  width: 100px;
  height: 35px;
  line-height: 35px;
  color: white;
  text-align: center;
  cursor: pointer;
  background-color: #3550de;
  border-radius: 4px;
`;

const DENOM = "FCT";

const DelegationCard = ({ targetStakingState }) => {
  const { targetValidator } = useSelector((state) => state.wallet);
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

    if (delegationList.length === 0) {
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

  const withdrawTx = (resolveTx, rejectTx) => {
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
          <Button onClick={delegateAction}>Delegate</Button>
          <Button onClick={redelegateAction}>Redelgate</Button>
          <Button onClick={undelegateAction}>Undelegate</Button>
        </Buttons>
      </InnerWrapper>
      <InnerWrapper>
        <Title>Rewards</Title>
        <Content>{`${numeral(targetStakingState.stakingReward).format("0,0.000")} ${DENOM}`}</Content>
        <Buttons>
          <Button onClick={withdrawAction}>Withdraw</Button>
        </Buttons>
      </InnerWrapper>
    </CardWrapper>
  );
};

export default DelegationCard;
