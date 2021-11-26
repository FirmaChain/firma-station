import React from "react";
import { useSelector } from "react-redux";

import { rootState } from "../redux/reducers";

import { ValidatorCard, DelegationCard, DelegatorsCard } from "../organisms/staking/validators";
import { useStakingData, useStakingDataFromTarget } from "../organisms/staking/hooks";
import { ContentContainer } from "../styles/validators";

const Validators = () => {
  const { isInit } = useSelector((state: rootState) => state.wallet);
  const { validatorsState } = useStakingData();
  const { targetStakingState } = useStakingDataFromTarget();

  return (
    <ContentContainer>
      {targetStakingState && validatorsState && isInit && (
        <DelegationCard targetStakingState={targetStakingState} validatorsState={validatorsState} />
      )}
      {validatorsState && (
        <>
          <ValidatorCard validatorsState={validatorsState} />
          <DelegatorsCard validatorsState={validatorsState} />
        </>
      )}
    </ContentContainer>
  );
};

export default React.memo(Validators);
