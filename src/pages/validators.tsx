import React from 'react';
import { useSelector } from 'react-redux';
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
import { rootState } from '../redux/reducers';
import { ContentContainer } from '../styles/validators';

const Validators = () => {
	const { isInit } = useSelector((state: rootState) => state.wallet);
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
