import { useEffect, useState } from 'react';
import { groupBy } from 'es-toolkit/array';
import ky from 'ky';

import { getProposalQueryFromId } from '../../utils/graphqlQuery';
import { CHAIN_CONFIG } from '../../config';
import { IProposalDetailState, IProposalsState } from '../../interfaces/governance';
import { IProposalQueryData } from '../../interfaces/gql';
import { IProposalData } from '../../interfaces/lcd';
import { useAvatarStore, useRefreshStore } from '../../store';
import { getAvatarInfoFromAcc } from '../../utils/avatar';
import { getProposalFromId, getProposalList } from '../../utils/lcdQuery';

export const useGovernanceData = () => {
	const refreshKey = useRefreshStore((state) => state.refreshKey);

	const [proposalsState, setProposalsState] = useState<IProposalsState>({
		proposals: []
	});

	useEffect(() => {
		getProposalList()
			.then(async (proposalList) => {
				let proposals: any[] = [];

				try {
					if (CHAIN_CONFIG.PROPOSAL_JSON !== '') {
						const response = await ky
							.get(`${CHAIN_CONFIG.PROPOSAL_JSON}?t=${new Date().getTime()}`)
							.json<{ ignoreProposalIdList?: number[] }>();
						const { ignoreProposalIdList } = response;
						const ignoredProposalIds = Array.isArray(ignoreProposalIdList) ? ignoreProposalIdList : [];

						proposals = proposalList
							.filter(({ proposalId }) => {
								return ignoredProposalIds.includes(Number(proposalId)) === false;
							})
							.map(({ proposalId, proposalTypeSummary, status, title, description }) => {
								return { proposalId, proposalTypeSummary, status, title, description };
							});
					} else {
						throw new Error('INVALID CONFIG');
					}
				} catch (error) {
					proposals = proposalList.map(({ proposalId, proposalTypeSummary, status, title, description }) => {
						return { proposalId, proposalTypeSummary, status, title, description };
					});
				}

				setProposalsState({
					proposals
				});
			})
			.catch((error) => {
				console.error('[governance] failed to load proposal list', error);
			});
	}, [refreshKey]); // eslint-disable-line react-hooks/exhaustive-deps

	return {
		proposalsState
	};
};

export const useProposalData = (proposalId: string, errorCallback?: (e: any) => void) => {
	const { avatarList } = useAvatarStore((state) => state);
	const refreshKey = useRefreshStore((state) => state.refreshKey);

	const [proposalState, setProposalState] = useState<IProposalDetailState | null>(null);

	const formatProposalQueryData = (data: IProposalQueryData | null) => {
		if (data) {
			const proposal = data.proposal[0];
			if (!proposal) return [];

			const depositors = proposal.proposal_deposits;
			const totalVotingPower = proposal.staking_pool_snapshot?.bonded_tokens;

			const latestVotesByVoter = Object.values(groupBy(proposal.proposal_votes, (vote) => vote.voter_address)).map(
				(votes) => votes[votes.length - 1]
			);

			const votes = latestVotesByVoter.map((vote) => {
				const { moniker, avatarURL } = getAvatarInfoFromAcc(avatarList, vote.voter_address);

				return {
					option: vote.option,
					voterAddress: vote.voter_address,
					moniker,
					avatarURL
				};
			});

			return {
				depositors,
				totalVotingPower,
				votes
			};
		}
	};

	useEffect(() => {
		getProposalFromId(proposalId)
			.then((proposalData: IProposalData) => {
				const title = proposalData.title;
				const description = proposalData.description;
				const status = proposalData.status;
				const proposalTypeSummary = proposalData.proposalTypeSummary;
				const submitTime = proposalData.submitTime;
				const votingStartTime = proposalData.votingStartTime;
				const votingEndTime = proposalData.votingEndTime;
				const paramMinDepositAmount = proposalData.paramMinDepositAmount;
				const paramQuorum = proposalData.paramQuorum;
				const periodDeposit = proposalData.periodDeposit;
				const extraData = proposalData.extraData;
				const messages = proposalData.messages;
				const tally = proposalData.tally;
				const proposer = proposalData.proposer;

				setProposalState({
					proposalId,
					title,
					description,
					status,
					proposalTypeSummary,
					submitTime,
					votingStartTime,
					votingEndTime,
					paramMinDepositAmount,
					paramQuorum,
					periodDeposit,
					extraData,
					messages,
					tally,
					totalVotingPower: 0,
					votes: [],
					depositors: [],
					proposer
				});

				getProposalQueryFromId(proposalId).then((proposalQueryData) => {
					const formatProposalData = formatProposalQueryData(proposalQueryData);
					setProposalState((prevState) => prevState && { ...prevState, ...formatProposalData });
				});
			})
			.catch((e) => {
				if (errorCallback) errorCallback(e);
			});
	}, [refreshKey]); // eslint-disable-line react-hooks/exhaustive-deps

	return {
		proposalState
	};
};
