import { useState } from "react";

import { convertNumber } from "../../utils/common";
import { useGovernmentQuery, useProposalQuery } from "../../apollo/gqls";

export interface tally {
  yes: number;
  no: number;
  noWithVeto: number;
  abstain: number;
  [key: string]: number;
}

export interface IProposalsState {
  proposals: Array<any>;
}

export interface IProposalState {
  proposalId: number;
  title: string;
  description: string;
  status: string;
  proposalType: string;
  submitTime: string;
  votingStartTime: string;
  votingEndTime: string;
  paramMinDepositAmount: number;
  paramQuorum: number;
  paramThreshold: number;
  paramVetoThreshold: number;
  periodDeposit: number;
  periodVoting: number;
  totalVotingPower: number;
  voters: Array<any>;
  depositors: Array<any>;
  tally: tally;
  extraData: any;
}

export const useGovernmentData = () => {
  const [proposalsState, setProposalsState] = useState<IProposalsState>({
    proposals: [],
  });

  useGovernmentQuery({
    onCompleted: (data) => {
      setProposalsState({
        proposals: data.proposals,
      });
    },
  });

  return {
    proposalsState,
  };
};

export const useProposalData = (proposalId: string) => {
  const [proposalState, setProposalState] = useState<IProposalState | null>(null);

  const formatTally = (data: any) => {
    let result: tally = {
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

  const formatExtraData = (data: any) => {
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

  const formatProposalType = (data: any) => {
    return data.proposal[0].content["@type"];
  };

  useProposalQuery({
    proposalId,
    onCompleted: (data) => {
      setProposalState({
        proposalId: data.proposal[0].proposalId,
        title: data.proposal[0].title,
        description: data.proposal[0].description,
        status: data.proposal[0].status,
        proposalType: formatProposalType(data),
        submitTime: data.proposal[0].submitTime,
        votingStartTime: data.proposal[0].votingStartTime,
        votingEndTime: data.proposal[0].votingEndTime,
        paramMinDepositAmount: convertNumber(data.govParams[0].depositParams["min_deposit"][0].amount),
        paramQuorum: convertNumber(data.govParams[0].tallyParams.quorum),
        paramThreshold: convertNumber(data.govParams[0].tallyParams.threshold),
        paramVetoThreshold: convertNumber(data.govParams[0].tallyParams["veto_threshold"]),
        periodDeposit: data.govParams[0].depositParams["max_deposit_period"] / 1000000000,
        periodVoting: data.govParams[0].votingParams["voting_period"] / 1000000000,
        totalVotingPower: data.proposal[0].staking_pool_snapshot.bonded_tokens,
        voters: data.proposalVote,
        depositors: data.proposal[0].proposalDeposits,
        tally: formatTally(data),
        extraData: formatExtraData(data),
      });
    },
  });

  return {
    proposalState,
  };
};
