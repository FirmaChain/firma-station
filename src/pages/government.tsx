import React from 'react';
import { useSelector } from 'react-redux';

import { rootState } from '../redux/reducers';
import { useGovernmentData } from '../organisms/government/hooks';

import { ProposalCard, ProposalButtons } from '../organisms/government';
import { ContentContainer } from '../styles/government';
import { useMediaQuery } from 'react-responsive';

const Government = () => {
  const { isInit } = useSelector((state: rootState) => state.wallet);
  const { proposalsState } = useGovernmentData();
  const isMobile = useMediaQuery({ query: '(min-width:0px) and (max-width:599px)' });

  return (
    <ContentContainer>
      {isInit && !isMobile && <ProposalButtons />}
      {proposalsState && <ProposalCard proposalsState={proposalsState} />}
    </ContentContainer>
  );
};

export default React.memo(Government);
