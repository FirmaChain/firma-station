import React from "react";
import { useSelector } from "react-redux";

import { rootState } from "../redux/reducers";
import { useGovernmentData } from "../organisms/government/hooks";

import { ProposalCard, ProposalButtons } from "../organisms/government";
import { ContentContainer } from "../styles/government";

const Government = () => {
  const { isInit } = useSelector((state: rootState) => state.wallet);
  const { proposalsState } = useGovernmentData();

  return (
    <ContentContainer>
      {isInit && <ProposalButtons />}
      {proposalsState && <ProposalCard proposalsState={proposalsState} />}
    </ContentContainer>
  );
};

export default React.memo(Government);
