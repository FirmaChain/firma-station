import React from "react";
import styled from "styled-components";
import numeral from "numeral";

import { modalActions } from "redux/action";

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
  width: 120px;
  text-align: center;
  height: 35px;
  line-height: 35px;
`;

const Content = styled.div`
  width: 120px;
  text-align: center;
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
  const delegate = () => {
    modalActions.handleModalDelegate(true);
  };
  const redelegate = () => {
    modalActions.handleModalRedelegate(true);
  };
  const undelegate = () => {
    modalActions.handleModalUndelegate(true);
  };
  const withdraw = () => {
    modalActions.handleModalData({
      action: "Withdraw",
      data: { amount: "1.5" },
    });

    modalActions.handleModalConfirmTx(true);
  };

  return (
    <CardWrapper>
      <InnerWrapper>
        <Title>My Delegations</Title>
        <Content>{`${numeral(targetStakingState.delegated).format("0,0.000")} FCT`}</Content>
        <Buttons>
          <Button onClick={delegate}>Delegate</Button>
          <Button onClick={redelegate}>Redelgate</Button>
          <Button onClick={undelegate}>Undelegate</Button>
        </Buttons>
      </InnerWrapper>
      <InnerWrapper>
        <Title>Rewards</Title>
        <Content>{`${numeral(targetStakingState.stakingReward).format("0,0.000")} FCT`}</Content>
        <Buttons>
          <Button onClick={withdraw}>Withdraw</Button>
        </Buttons>
      </InnerWrapper>
    </CardWrapper>
  );
};

export default DelegationCard;
