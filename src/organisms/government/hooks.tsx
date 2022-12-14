import { useState, useEffect } from 'react';

import { getProposalQueryFromId } from '../../apollo/gqls/query';
import { getProposalFromId, getProposalList } from '../../utils/lcdQuery';

import { IProposalsState, IProposalDetailState } from '../../interfaces/governance';
import { IProposalData } from '../../interfaces/lcd';
import { IProposalQueryData } from '../../interfaces/gql';

export const useGovernmentData = () => {
  const [proposalsState, setProposalsState] = useState<IProposalsState>({
    proposals: [],
  });

  useEffect(() => {
    getProposalList()
      .then((proposalList) => {
        setProposalsState({
          proposals: proposalList.map(({ proposalId, proposalType, status, title, description }) => {
            return { proposalId, proposalType, status, title, description };
          }),
        });
      })
      .catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    proposalsState,
  };
};

export const useProposalData = (proposalId: string) => {
  const [proposalState, setProposalState] = useState<IProposalDetailState | null>(null);

  const formatProposalQueryData = (data: IProposalQueryData | null) => {
    if (data) {
      const depositors = data.proposal[0].proposal_deposits;
      const totalVotingPower = data.proposal[0].staking_pool_snapshot.bonded_tokens;
      const votes = data.proposal[0].proposal_votes.map((vote: any) => {
        return {
          option: vote.option,
          voterAddress: vote.voter_address,
          moniker: vote.voter_address,
          avatarURL: '',
        };
      });

      return {
        depositors,
        totalVotingPower,
        votes,
      };
    }
  };

  useEffect(() => {
    getProposalFromId(proposalId).then((proposalData: IProposalData) => {
      const title = proposalData.title;
      const description = proposalData.description;
      const status = proposalData.status;
      const proposalType = proposalData.proposalType;
      const submitTime = proposalData.submitTime;
      const votingStartTime = proposalData.votingStartTime;
      const votingEndTime = proposalData.votingEndTime;
      const paramMinDepositAmount = proposalData.paramMinDepositAmount;
      const paramQuorum = proposalData.paramQuorum;
      const periodDeposit = proposalData.periodDeposit;
      const extraData = proposalData.extraData;
      const tally = proposalData.tally;

      setProposalState({
        proposalId,
        title,
        description,
        status,
        proposalType,
        submitTime,
        votingStartTime,
        votingEndTime,
        paramMinDepositAmount,
        paramQuorum,
        periodDeposit,
        extraData,
        tally,
        totalVotingPower: 0,
        votes: [],
        depositors: [],
      });

      getProposalQueryFromId(proposalId).then((proposalQueryData) => {
        const formatProposalData = formatProposalQueryData(proposalQueryData);
        setProposalState((prevState) => prevState && { ...prevState, ...formatProposalData });
      });
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    proposalState,
  };
};
