import React from 'react';
import { useMediaQuery } from 'react-responsive';

import { ProposalButtons, ProposalCard } from '../organisms/governance';
import { useGovernanceData } from '../organisms/governance/hooks';
import { useWalletStore } from '../store';
import { ContentContainer } from '../styles/governance';

const Governance = () => {
	const { isInit } = useWalletStore((state) => state);
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
