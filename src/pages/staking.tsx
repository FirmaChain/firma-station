import React from 'react';
import { useMediaQuery } from 'react-responsive';

import { DelegationCard, StakingCard, ValidatorsCard } from '../organisms/staking';
import { useGrantData, useStakingData, useValidators } from '../organisms/staking/hooks';
import { useWalletStore } from '../store';
import { ContentContainer } from '../styles/staking';

const Staking = () => {
	const { isInit } = useWalletStore((state) => state);
	const { totalStakingState } = useStakingData();
	const { validatorsState } = useValidators();
	const { grantDataState } = useGrantData();

	const isMobile = useMediaQuery({ query: '(min-width:0px) and (max-width:599px)' });

	return (
		<ContentContainer>
			{isInit && totalStakingState && (
				<>
					<StakingCard totalStakingState={totalStakingState} />
					{totalStakingState.delegationList.length +
						totalStakingState.redelegationList.length +
						totalStakingState.undelegationList.length >
						0 &&
						isMobile === false && <DelegationCard totalStakingState={totalStakingState} grantDataState={grantDataState} />}
				</>
			)}

			{validatorsState && <ValidatorsCard validatorsState={validatorsState} />}
		</ContentContainer>
	);
};

export default React.memo(Staking);
