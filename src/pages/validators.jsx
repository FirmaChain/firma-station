import React from "react";
import { useSelector } from "react-redux";

import { ContentContainer } from "styles/validstors";
import { ValidatorCard, DelegationCard, DelegatorsCard } from "organisms/staking/validators";
import { useStakingData } from "organisms/staking/hooks";

const Validators = () => {
  const { isInit } = useSelector((state) => state.wallet);
  const { targetStakingState, validatorsState } = useStakingData();

  return (
    <ContentContainer>
      {targetStakingState && isInit && <DelegationCard targetStakingState={targetStakingState} />}
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
