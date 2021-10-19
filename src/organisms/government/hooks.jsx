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
  const [proposalState, setProposalState] = useState({});

  useProposalQuery({
    proposalId,
    onCompleted: (data) => {
      console.log(data);
      setProposalState((prevState) => ({
        ...prevState,
        proposalId: data.proposal[0].proposalId,
        title: data.proposal[0].title,
        description: data.proposal[0].description,
        status: data.proposal[0].status,
        proposalType: data.proposal[0].content["@type"],
        submitTime: data.proposal[0].submitTime,
        votingStartTime: data.proposal[0].votingStartTime,
        votingEndTime: data.proposal[0].votingEndTime,
        proposalDeposits: data.proposal[0].proposalDeposits,
        paramMinDepositAmount: data.govParams[0].depositParams["min_deposit"][0].amount,
        paramQuorum: data.govParams[0].tallyParams.quorum,
        paramThreshold: data.govParams[0].tallyParams.threshold,
        paramVetoThreshold: data.govParams[0].tallyParams["veto_threshold"],
        periodDeposit: data.govParams[0].depositParams["max_deposit_period"] / 1000000000,
        periodVoting: data.govParams[0].votingParams["voting_period"] / 1000000000,
      }));
    },
  });

  return {
    proposalState,
  };
};
