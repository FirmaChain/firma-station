import React from 'react';
import { useMediaQuery } from 'react-responsive';

import {
	useDelegations,
	useGrantData,
	useRedelegations,
	useStakingDataFromTarget,
	useUndelegations,
	useValidatorFromTarget
} from '../organisms/staking/hooks';
import { DelegatorsCard, ValidatorControlCard, ValidatorInfoCard } from '../organisms/staking/validator';
import { useWalletStore } from '../store';
import { ContentContainer } from '../styles/validators';

const Validators = () => {
	const { isInit } = useWalletStore((state) => state);
	const { targetStakingState } = useStakingDataFromTarget();
	const { validatorState } = useValidatorFromTarget();
	const { delegateState } = useDelegations();
	const { redelegateState } = useRedelegations();
	const { undelegateState } = useUndelegations();
	const { grantDataState } = useGrantData();

	const isMobile = useMediaQuery({ query: '(min-width:0px) and (max-width:599px)' });

	return (
		<ContentContainer>
			{targetStakingState && isInit && isMobile === false && (
				<ValidatorControlCard targetStakingState={targetStakingState} grantDataState={grantDataState} />
			)}
			<ValidatorInfoCard targetValidatorData={validatorState} />
			<DelegatorsCard delegateState={delegateState} redelegateState={redelegateState} undelegateState={undelegateState} />
		</ContentContainer>
	);
};

export default React.memo(Validators);
