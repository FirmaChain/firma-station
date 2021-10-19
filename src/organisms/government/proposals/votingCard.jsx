import React from "react";
import numeral from "numeral";
import styled from "styled-components";

import Gauge from "components/gauge";
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
  padding-bottom: 20px;
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

const VotingWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const VotingData = styled.div`
  width: calc(50% - 60px);
  padding: 20px 30px;
`;
const VotingType = styled.div`
  font-size: 18px;
  ${(props) => props.color && `color:${props.color};`}
`;
const VotingGauge = styled.div`
  margin: 10px 0;
`;
const VotingPercent = styled.div`
  width: 50%;
  float: left;
  color: #aaa;
`;
const VotingValue = styled.div`
  width: 50%;
  float: left;
  text-align: right;
  color: #aaa;
`;

const VotingButton = styled.div`
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

const VotingCard = ({ proposalState }) => {
  const votingData = [
    { type: "YES", percent: 0.8812, value: 19123555, color: "#2BA891" },
    { type: "NO", percent: 0.1211, value: 1123555, color: "#F17047" },
    { type: "NoWithVeto", percent: 0.01, value: 1955, color: "#E79720" },
    { type: "Abstain", percent: 0.0512, value: 13555, color: "#9438DC" },
  ];

  return (
    <CardWrapper>
      <MainTitle>Voting</MainTitle>
      <DetailWrapper>
        <DetailItem>
          <Label>Voting Time</Label>
          <Content>2021-10-18 10:00:00 ~ 2021-10-18 10:00:00</Content>
        </DetailItem>
        <DetailItem>
          <Label>Quorum</Label>
          <Content bigSize={true}>33.40%</Content>
        </DetailItem>
        <DetailItem>
          <Label>Current Turnout</Label>
          <Content bigSize={true}>11.50%</Content>
        </DetailItem>
      </DetailWrapper>
      <VotingWrapper>
        {votingData.map((voting, index) => (
          <VotingData key={index}>
            <VotingType color={voting.color}>{voting.type}</VotingType>
            <VotingGauge>
              <Gauge percent={`${numeral(voting.percent * 100).format("0.00")}%`} bgColor={voting.color} />
            </VotingGauge>
            <VotingPercent>{`${numeral(voting.percent * 100).format("0.00")}%`} </VotingPercent>
            <VotingValue>{numeral(voting.value).format("0,0.00")}</VotingValue>
          </VotingData>
        ))}
      </VotingWrapper>
      {proposalState.status === "PROPOSAL_STATUS_VOTING_PERIOD" && (
        <VotingButton
          active={true}
          onClick={() => {
            modalActions.handleModalData({
              proposalId: proposalState.proposalId,
            });
            modalActions.handleModalVoting(true);
          }}
        >
          Vote
        </VotingButton>
      )}
    </CardWrapper>
  );
};

export default VotingCard;
