import React from 'react';

import { PROPOSAL_STATUS_DEPOSIT_PERIOD, PROPOSAL_STATUS_VOTING_PERIOD } from '../constants/governance';
import CancelProposalButton from '../organisms/governance/cancelProposalButton';
import { useProposalData } from '../organisms/governance/hooks';
import { DepositCard, ProposalDetailCard, VotingCard } from '../organisms/governance/proposals';
import { useWalletStore } from '../store';
import { ContentContainer } from '../styles/governance';

const Proposals = () => {
	const proposalId = window.location.pathname.replace('/governance/proposals/', '');
	const { proposalState } = useProposalData(proposalId, () => (window.location.href = '/governance'));
	const address = useWalletStore((state) => state.address);

	return (
		<ContentContainer>
			{proposalState && (
				<>
					<ProposalDetailCard proposalState={proposalState} />
					<VotingCard proposalState={proposalState} />
					{proposalState.depositors?.length > 0 && <DepositCard proposalState={proposalState} />}
				</>
			)}
			{proposalState?.proposer === address &&
				[PROPOSAL_STATUS_DEPOSIT_PERIOD, PROPOSAL_STATUS_VOTING_PERIOD].includes(proposalState.status) && (
					<CancelProposalButton proposalId={proposalState.proposalId} />
				)}
		</ContentContainer>
	);
};

export default React.memo(Proposals);
