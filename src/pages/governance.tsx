import React from 'react';
import { useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';

import { ProposalButtons, ProposalCard } from '../organisms/governance';
import { useGovernanceData } from '../organisms/governance/hooks';
import { rootState } from '../redux/reducers';
import { ContentContainer } from '../styles/governance';

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
