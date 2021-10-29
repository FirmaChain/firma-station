import React from "react";

import { useProposalData } from "../organisms/government/hooks";

import { ProposalDetailCard, VotingCard, DepositCard } from "../organisms/government/proposals";
import { ContentContainer } from "../styles/government";

const Proposals = () => {
  const proposalId = window.location.pathname.replace("/government/proposals/", "");
  const { proposalState } = useProposalData(proposalId);

  return (
    <ContentContainer>
      {proposalState && (
        <>
          <ProposalDetailCard proposalState={proposalState} />
          <VotingCard proposalState={proposalState} />
          <DepositCard proposalState={proposalState} />
        </>
      )}
    </ContentContainer>
  );
};

export default React.memo(Proposals);
