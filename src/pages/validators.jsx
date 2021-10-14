import React from "react";
import { useSelector } from "react-redux";

import { ContentContainer } from "styles/validstors";
import { ValidatorCard, DelegationCard } from "organisms/staking/validators";
import { useStakingData } from "organisms/staking/hooks";

const Validators = (props) => {
  const { isInit } = useSelector((state) => state.wallet);
  const { targetStakingState } = useStakingData();

  return (
    <ContentContainer>
      {isInit && <DelegationCard targetStakingState={targetStakingState} />}
      <ValidatorCard />
    </ContentContainer>
  );
};

export default React.memo(Validators);
