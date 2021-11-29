import React from "react";
import numeral from "numeral";
import moment from "moment";

import { IProposalState, tally } from "../hooks";
import { convertToFctNumber } from "../../../utils/common";
import { modalActions } from "../../../redux/action";

import Gauge from "../../../components/gauge";
import {
  CardWrapper,
  VotingDetailWrapper,
  VotingDetailItem,
  VotingLabel,
  VotingContent,
  VotingMainTitle,
  VotingWrapper,
  VotingData,
  VotingType,
  VotingGauge,
  VotingPercent,
  VotingValue,
  VotingButton,
} from "./styles";

interface IProps {
  proposalState: IProposalState;
}

const VotingCard = ({ proposalState }: IProps) => {
  const getTimeFormat = (time: string) => {
    return moment(time).format("YYYY-MM-DD HH:mm:ss");
  };

  const getTallyPercent = (proposalState: IProposalState, targetKey: string) => {
    let currentVoting = 0;
    for (let value in proposalState.tally) {
      if (value === "abstain") continue;
      currentVoting += proposalState.tally[value];
    }

    return proposalState.tally[targetKey] / currentVoting;
  };

  const getTallyValue = (proposalState: IProposalState, targetKey: string) => {
    return convertToFctNumber(proposalState.tally[targetKey]);
  };

  const getCurrentVotingPower = (tally: tally, totalVotingPower: number) => {
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
    {
      type: "Abstain",
      percent: getTallyPercent(proposalState, "abstain"),
      value: getTallyValue(proposalState, "abstain"),
      color: "#9438DC",
    },
  ];

  return (
    <CardWrapper>
      <VotingMainTitle>Voting</VotingMainTitle>
      <VotingDetailWrapper>
        <VotingDetailItem>
          <VotingLabel>Voting Time</VotingLabel>
          <VotingContent>
            {getTimeFormat(proposalState.votingStartTime)} ~ {getTimeFormat(proposalState.votingEndTime)}
          </VotingContent>
        </VotingDetailItem>
        <VotingDetailItem>
          <VotingLabel>Quorum</VotingLabel>
          <VotingContent bigSize={true}>{numeral(proposalState.paramQuorum * 100).format("0.00")}%</VotingContent>
        </VotingDetailItem>
        <VotingDetailItem>
          <VotingLabel>Current Turnout</VotingLabel>
          <VotingContent bigSize={true}>
            {numeral(getCurrentVotingPower(proposalState.tally, proposalState.totalVotingPower)).format("0.00")}%
          </VotingContent>
        </VotingDetailItem>
      </VotingDetailWrapper>
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
