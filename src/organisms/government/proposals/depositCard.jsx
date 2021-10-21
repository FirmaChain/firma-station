import React from "react";
import moment from "moment";
import numeral from "numeral";
import styled from "styled-components";

import { modalActions } from "redux/action";

const CardWrapper = styled.div`
  display: flex;
  padding: 24px;
  background-color: #1b1c22;
  flex-direction: column;
`;

const DetailWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px 0;
  margin-bottom: 20px;
`;

const DetailItem = styled.div`
  width: 100%;
  display: flex;
  font-size: 16px;
`;

const Label = styled.div`
  width: 200px;
  color: #808080;
`;

const Content = styled.div`
  width: 100%;
  color: #bbb;
  ${(props) => props.bigSize && "font-size:18px;color:#eee"}
`;

const MainTitle = styled.div`
  font-size: 20px;
  color: #aaa;
  margin-bottom: 30px;
`;

const DepositButton = styled.div`
  width: 100px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  margin: 30px auto 0 auto;
  color: white;
  background-color: #3550de;
  border-radius: 4px;
  cursor: pointer;
  ${(props) => (props.active ? `` : `background-color: #444;color:#777`)}
`;

const DepositCard = ({ proposalState }) => {
  const getAddTimeFormat = (startTime, second) => {
    return moment(startTime).add(numeral(second).value(), "seconds").format("YYYY-MM-DD HH:mm:ss");
  };

  const getCurrentDeposit = (deposits) => {
    if (deposits === undefined) return 0;

    let totalDeposit = 0;
    for (let value of deposits) totalDeposit += numeral(value.amount[0].amount).value();

    return totalDeposit;
  };

  return (
    <CardWrapper>
      <MainTitle>Deposit</MainTitle>
      <DetailWrapper>
        <DetailItem>
          <Label>Deposit Period</Label>
          <Content>{getAddTimeFormat(proposalState.submitTime, proposalState.periodDeposit)}</Content>
        </DetailItem>
        <DetailItem>
          <Label>Min Deposit Amount</Label>
          <Content bigSize={true}>{`${numeral(proposalState.paramMinDepositAmount / 1000000).format(
            "0.00"
          )} FCT`}</Content>
        </DetailItem>
        <DetailItem>
          <Label>Current Deposit</Label>
          <Content bigSize={true}>
            {`${numeral(getCurrentDeposit(proposalState.depositors) / 1000000).format("0.00")} FCT`}
          </Content>
        </DetailItem>
      </DetailWrapper>
      {proposalState.status === "PROPOSAL_STATUS_DEPOSIT_PERIOD" && (
        <DepositButton
          active={true}
          onClick={() => {
            modalActions.handleModalData({
              proposalId: proposalState.proposalId,
            });
            modalActions.handleModalDeposit(true);
          }}
        >
          Deposit
        </DepositButton>
      )}
    </CardWrapper>
  );
};

export default DepositCard;
