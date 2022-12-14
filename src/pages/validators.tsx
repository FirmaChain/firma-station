import React from 'react';
import { useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { rootState } from '../redux/reducers';

import { ValidatorCard, DelegationCard, DelegatorsCard } from '../organisms/staking/validators';
import { useValidatorFromTarget, useStakingDataFromTarget, useDelegations } from '../organisms/staking/hooks';
import { ContentContainer } from '../styles/validators';

const Validators = () => {
  const { isInit } = useSelector((state: rootState) => state.wallet);
  const { targetStakingState } = useStakingDataFromTarget();
  const { validatorState } = useValidatorFromTarget();
  const { delegateState } = useDelegations();

  const isMobile = useMediaQuery({ query: '(min-width:0px) and (max-width:599px)' });

  return (
    <ContentContainer>
      {targetStakingState && isInit && isMobile === false && <DelegationCard targetStakingState={targetStakingState} />}
      <>
        <ValidatorCard targetValidatorData={validatorState} />
        <DelegatorsCard delegateState={delegateState} />
      </>
    </ContentContainer>
  );
};

export default React.memo(Validators);
