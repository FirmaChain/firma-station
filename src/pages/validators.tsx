import React from 'react';
import { useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { rootState } from '../redux/reducers';

import { ValidatorCard, DelegationCard, DelegatorsCard } from '../organisms/staking/validators';
import { useStakingData, useStakingDataFromTarget, useDelegations } from '../organisms/staking/hooks';
import { ContentContainer } from '../styles/validators';

const Validators = () => {
  const getValidatorAddress = () => {
    return window.location.pathname.replace('/staking/validators/', '');
  };

  const { isInit } = useSelector((state: rootState) => state.wallet);
  const { validatorsState } = useStakingData();
  const { targetStakingState } = useStakingDataFromTarget();
  const [targetValidatorData] = validatorsState.validators.filter(
    (value) => value.validatorAddress === getValidatorAddress()
  );

  const { delegateState } = useDelegations(getValidatorAddress(), targetValidatorData?.selfDelegateAddress);

  const isMobile = useMediaQuery({ query: '(min-width:0px) and (max-width:599px)' });

  return (
    <ContentContainer>
      {targetStakingState && validatorsState && isInit && isMobile === false && (
        <DelegationCard targetStakingState={targetStakingState} validatorsState={validatorsState} />
      )}
      {validatorsState && (
        <>
          <ValidatorCard targetValidatorData={targetValidatorData} delegateState={delegateState} />
          <DelegatorsCard delegateState={delegateState} />
        </>
      )}
    </ContentContainer>
  );
};

export default React.memo(Validators);
