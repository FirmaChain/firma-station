import React from "react";
import { ContentContainer } from "styles/staking";
import { StakingCard, ValidatorsCard } from "organisms/staking";
import { useSelector } from "react-redux";
import { useStakingData } from "organisms/staking/hooks";

const Staking = () => {
  const { isInit } = useSelector((state) => state.wallet);
  const { totalStakingState, validatorsState } = useStakingData();

  return (
    <ContentContainer>
      {isInit && totalStakingState && <StakingCard totalStakingState={totalStakingState} />}
      {validatorsState && <ValidatorsCard validatorsState={validatorsState} />}
    </ContentContainer>
  );
};

export default React.memo(Staking);
