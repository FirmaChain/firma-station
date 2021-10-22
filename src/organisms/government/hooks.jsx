import { useState } from "react";
import { useGovernmentQuery, useProposalQuery } from "apollo/gqls";

export const useGovernmentData = () => {
  const [proposalsState, setProposalsState] = useState({
    proposals: [],
  });

  useGovernmentQuery({
    onCompleted: (data) => {
      setProposalsState((prevState) => ({
        ...prevState,
        proposals: data.proposals,
      }));
    },
  });

  return {
    proposalsState,
  };
};

export const useProposalData = (proposalId) => {
  const [proposalState, setProposalState] = useState(null);

  const formatTally = (data) => {
    let result = {
      yes: 0,
      no: 0,
      noWithVeto: 0,
      abstain: 0,
    };

    if (data.proposalTallyResult.length > 0)
      result = {
        yes: data.proposalTallyResult[0].yes,
        no: data.proposalTallyResult[0].no,
        noWithVeto: data.proposalTallyResult[0].noWithVeto,
        abstain: data.proposalTallyResult[0].abstain,
      };

    return result;
  };

  const formatExtraData = (data) => {
    if (data.proposal[0].content.plan) {
      return {
        height: data.proposal[0].content.plan.height,
        name: data.proposal[0].content.plan.name,
        info: data.proposal[0].content.plan.info,
      };
    }
    if (data.proposal[0].content.recipient) {
      return {
        recipient: data.proposal[0].content.recipient,
        amount: data.proposal[0].content.amount[0].amount,
      };
    }
    if (data.proposal[0].content.changes) {
      return {
        changes: data.proposal[0].content.changes,
      };
    }
  };

  const formatProposalType = (data) => {
    return data.proposal[0].content["@type"];
  };

  useProposalQuery({
    proposalId,
    onCompleted: (data) => {
      setProposalState((prevState) => ({
        ...prevState,
        proposalId: data.proposal[0].proposalId,
        title: data.proposal[0].title,
        description: data.proposal[0].description,
        status: data.proposal[0].status,
        proposalType: formatProposalType(data),
        submitTime: data.proposal[0].submitTime,
        votingStartTime: data.proposal[0].votingStartTime,
        votingEndTime: data.proposal[0].votingEndTime,
        paramMinDepositAmount: data.govParams[0].depositParams["min_deposit"][0].amount,
        paramQuorum: data.govParams[0].tallyParams.quorum,
        paramThreshold: data.govParams[0].tallyParams.threshold,
        paramVetoThreshold: data.govParams[0].tallyParams["veto_threshold"],
        periodDeposit: data.govParams[0].depositParams["max_deposit_period"] / 1000000000,
        periodVoting: data.govParams[0].votingParams["voting_period"] / 1000000000,
        totalVotingPower: data.stakingPool[0].totalVotingPower,
        voters: data.proposalVote,
        depositors: data.proposal[0].proposalDeposits,
        tally: formatTally(data),
        extraData: formatExtraData(data),
      }));
    },
  });

  return {
    proposalState,
  };
};
