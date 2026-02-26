import React from 'react';

import { useProposalData } from '../organisms/governance/hooks';

import { ProposalDetailCard, VotingCard, DepositCard } from '../organisms/governance/proposals';
import { ContentContainer } from '../styles/governance';
import { rootState } from '../redux/reducers';
import { useSelector } from 'react-redux';
import CancelProposalButton from '../organisms/governance/cancelProposalButton';
import { PROPOSAL_STATUS_DEPOSIT_PERIOD, PROPOSAL_STATUS_VOTING_PERIOD } from '../constants/governance';

const Proposals = () => {
  const proposalId = window.location.pathname.replace('/governance/proposals/', '');
  const { proposalState } = useProposalData(proposalId, () => (window.location.href = '/governance'));
  const address = useSelector((v: rootState) => v.wallet.address);

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
