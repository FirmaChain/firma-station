import React from "react";
import numeral from "numeral";
import moment from "moment";
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
  const getTimeFormat = (time) => {
    return moment(time).format("YYYY-MM-DD HH:mm:ss");
  };

  const getTallyPercent = (proposalState, targetKey) => {
    let currentVoting = 0;
    for (let value in proposalState.tally) {
      if (value === "abstain") continue;
      currentVoting += proposalState.tally[value];
    }

    return proposalState.tally[targetKey] / currentVoting;
  };

  const getTallyValue = (proposalState, targetKey) => {
    return proposalState.tally[targetKey] / 1000000;
  };

  const getCurrentVotingPower = (tally, totalVotingPower) => {
    let currentVoting = 0;
    for (let value in tally) {
      if (value === "abstain") continue;
      currentVoting += tally[value];
    }

    return (currentVoting / totalVotingPower) * 100;
  };

  const votingData = [
    {
      type: "YES",
      percent: getTallyPercent(proposalState, "yes"),
      value: getTallyValue(proposalState, "yes"),
      color: "#2BA891",
    },
    {
      type: "Abstain",
      percent: getTallyPercent(proposalState, "abstain"),
      value: getTallyValue(proposalState, "abstain"),
      color: "#9438DC",
    },
    {
      type: "NO",
      percent: getTallyPercent(proposalState, "no"),
      value: getTallyValue(proposalState, "no"),
      color: "#F17047",
    },
    {
      type: "NoWithVeto",
      percent: getTallyPercent(proposalState, "noWithVeto"),
      value: getTallyValue(proposalState, "noWithVeto"),
      color: "#E79720",
    },
  ];

  return (
    <CardWrapper>
      <MainTitle>Voting</MainTitle>
      <DetailWrapper>
        <DetailItem>
          <Label>Voting Time</Label>
          <Content>
            {getTimeFormat(proposalState.votingStartTime)} ~ {getTimeFormat(proposalState.votingEndTime)}
          </Content>
        </DetailItem>
        <DetailItem>
          <Label>Quorum</Label>
          <Content bigSize={true}>{numeral(proposalState.paramQuorum * 100).format("0.00")}%</Content>
        </DetailItem>
        <DetailItem>
          <Label>Current Turnout</Label>
          <Content bigSize={true}>
            {numeral(getCurrentVotingPower(proposalState.tally, proposalState.totalVotingPower)).format("0.00")}%
          </Content>
        </DetailItem>
      </DetailWrapper>
      <VotingWrapper>
        {votingData.map((voting, index) => (
          <VotingData key={index}>
            <VotingType color={voting.color}>{voting.type}</VotingType>
            <VotingGauge>
              <Gauge percent={`${numeral(voting.percent * 100).format("0.00")}%`} bgColor={voting.color} />
            </VotingGauge>
            <VotingPercent>
              {voting.type !== "Abstain" ? `${numeral(voting.percent * 100).format("0.00")}%` : "ㅤ"}
            </VotingPercent>
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
