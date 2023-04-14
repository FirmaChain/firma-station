import axios from 'axios';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { rootState } from '../../redux/reducers';
import { getProposalQueryFromId } from '../../apollo/gqls/query';
import { getProposalFromId, getProposalList } from '../../utils/lcdQuery';
import { getAvatarInfoFromAcc } from '../../utils/avatar';

import { IProposalsState, IProposalDetailState } from '../../interfaces/governance';
import { IProposalData } from '../../interfaces/lcd';
import { IProposalQueryData } from '../../interfaces/gql';
import { CHAIN_CONFIG } from '../../config';

export const useGovernmentData = () => {
  const [proposalsState, setProposalsState] = useState<IProposalsState>({
    proposals: [],
  });

  useEffect(() => {
    getProposalList()
      .then(async (proposalList) => {
        let proposals: any[] = [];

        try {
          if (CHAIN_CONFIG.PROPOSAL_JSON !== '') {
            const response = await axios.get(`${CHAIN_CONFIG.PROPOSAL_JSON}?t=${new Date().getTime()}`);
            const { ignoreProposalIdList } = response.data;

            proposals = proposalList
              .filter(({ proposalId }) => {
                return ignoreProposalIdList.includes(Number(proposalId)) === false;
              })
              .map(({ proposalId, proposalType, status, title, description }) => {
                return { proposalId, proposalType, status, title, description };
              });
          } else {
            throw new Error('INVALID CONFIG');
          }
        } catch (error) {
          proposals = proposalList.map(({ proposalId, proposalType, status, title, description }) => {
            return { proposalId, proposalType, status, title, description };
          });
        }

        setProposalsState({
          proposals,
        });
      })
      .catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    proposalsState,
  };
};

export const useProposalData = (proposalId: string) => {
  const { avatarList } = useSelector((state: rootState) => state.avatar);

  const [proposalState, setProposalState] = useState<IProposalDetailState | null>(null);

  const formatProposalQueryData = (data: IProposalQueryData | null) => {
    if (data) {
      const depositors = data.proposal[0].proposal_deposits;
      const totalVotingPower = data.proposal[0].staking_pool_snapshot.bonded_tokens;
      const votes = data.proposal[0].proposal_votes.map((vote: any) => {
        const { moniker, avatarURL } = getAvatarInfoFromAcc(avatarList, vote.voter_address);

        return {
          option: vote.option,
          voterAddress: vote.voter_address,
          moniker,
          avatarURL,
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
