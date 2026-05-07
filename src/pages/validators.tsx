import React from 'react';
import { useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { rootState } from '../redux/reducers';

import { ValidatorInfoCard, ValidatorControlCard, DelegatorsCard } from '../organisms/staking/validator';
import {
  useValidatorFromTarget,
  useStakingDataFromTarget,
  useDelegations,
  useRedelegations,
  useUndelegations,
} from '../organisms/staking/hooks';
import { ContentContainer } from '../styles/validators';

const Validators = () => {
  const { isInit } = useSelector((state: rootState) => state.wallet);
  const { targetStakingState } = useStakingDataFromTarget();
  const { validatorState } = useValidatorFromTarget();
  const { delegateState } = useDelegations();
  const { redelegateState } = useRedelegations();
  const { undelegateState } = useUndelegations();

  const isMobile = useMediaQuery({ query: '(min-width:0px) and (max-width:599px)' });

  return (
    <ContentContainer>
      {targetStakingState && isInit && isMobile === false && (
        <ValidatorControlCard targetStakingState={targetStakingState} />
      )}
      <ValidatorInfoCard targetValidatorData={validatorState} />
      <DelegatorsCard
        delegateState={delegateState}
        redelegateState={redelegateState}
        undelegateState={undelegateState}
      />
    </ContentContainer>
  );
};

export default React.memo(Validators);
