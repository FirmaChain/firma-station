import React from 'react';

import { useProposalData } from '../organisms/government/hooks';

import { ProposalDetailCard, VotingCard, DepositCard } from '../organisms/government/proposals';
import { ContentContainer } from '../styles/government';
import { rootState } from '../redux/reducers';
import { useSelector } from 'react-redux';
import CancelProposalButton from '../organisms/government/cancelProposalButton';
import { PROPOSAL_STATUS_DEPOSIT_PERIOD, PROPOSAL_STATUS_VOTING_PERIOD } from '../constants/government';

const Proposals = () => {
  const proposalId = window.location.pathname.replace('/government/proposals/', '');
  const { proposalState } = useProposalData(proposalId, () => (window.location.href = '/government'));
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
