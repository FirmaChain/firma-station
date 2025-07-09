import React from 'react';

import { useProposalData } from '../organisms/government/hooks';

import { ProposalDetailCard, VotingCard, DepositCard } from '../organisms/government/proposals';
import { ContentContainer } from '../styles/government';
import { rootState } from '../redux/reducers';
import { useSelector } from 'react-redux';
import CancelProposalButton from '../organisms/government/cancelProposalButton';

const Proposals = () => {
  const proposalId = window.location.pathname.replace('/government/proposals/', '');
  const { proposalState } = useProposalData(proposalId);
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
      {proposalState?.proposer === address && <CancelProposalButton proposalId={proposalState.proposalId} />}
    </ContentContainer>
  );
};

export default React.memo(Proposals);
