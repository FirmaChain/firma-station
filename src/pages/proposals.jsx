import React from "react";

import { ContentContainer } from "styles/government";
import { ProposalDetailCard, VotingCard, DepositCard } from "organisms/government/proposals";
import { useProposalData } from "organisms/government/hooks";

const Proposals = () => {
  const proposalId = window.location.pathname.replace("/government/proposals/", "");
  const { proposalState } = useProposalData(proposalId);
  return (
    <ContentContainer>
      <ProposalDetailCard proposalState={proposalState} />
      <VotingCard proposalState={proposalState} />
      <DepositCard proposalState={proposalState} />
    </ContentContainer>
  );
};

export default React.memo(Proposals);
