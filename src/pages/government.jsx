import React from "react";
import { useSelector } from "react-redux";

import { ContentContainer } from "styles/government";
import { ProposalCard, ProposalButtons } from "organisms/government";
import { useGovernmentData } from "organisms/government/hooks";

const Government = () => {
  const { isInit } = useSelector((state) => state.wallet);
  const { proposalsState } = useGovernmentData();

  return (
    <ContentContainer>
      {isInit && <ProposalButtons />}
      {proposalsState && <ProposalCard proposalsState={proposalsState} />}
    </ContentContainer>
  );
};

export default React.memo(Government);
