import React from "react";

import { ContentContainer } from "styles/government";
import { ProposalCard, ProposalButtons } from "organisms/government";
import { useGovernmentData } from "organisms/government/hooks";

const Government = () => {
  const { proposalsState } = useGovernmentData();

  return (
    <ContentContainer>
      <ProposalButtons />
      <ProposalCard proposalsState={proposalsState} />
    </ContentContainer>
  );
};

export default React.memo(Government);
