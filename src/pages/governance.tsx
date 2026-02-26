import React from 'react';
import { useSelector } from 'react-redux';

import { rootState } from '../redux/reducers';
import { useGovernanceData } from '../organisms/governance/hooks';

import { ProposalCard, ProposalButtons } from '../organisms/governance';
import { ContentContainer } from '../styles/governance';
import { useMediaQuery } from 'react-responsive';

const Governance = () => {
  const { isInit } = useSelector((state: rootState) => state.wallet);
  const { proposalsState } = useGovernanceData();
  const isMobile = useMediaQuery({ query: '(min-width:0px) and (max-width:599px)' });

  return (
    <ContentContainer>
      {isInit && !isMobile && <ProposalButtons />}
      {proposalsState && <ProposalCard proposalsState={proposalsState} />}
    </ContentContainer>
  );
};

export default React.memo(Governance);
