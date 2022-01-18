import React from "react";
import { useSelector } from "react-redux";

import { rootState } from "../redux/reducers";

import { StakingCard, ValidatorsCard, DelegationCard } from "../organisms/staking";
import { useStakingData } from "../organisms/staking/hooks";
import { ContentContainer } from "../styles/staking";

const Staking = () => {
  const { isInit } = useSelector((state: rootState) => state.wallet);
  const { totalStakingState, validatorsState } = useStakingData();

  return (
    <ContentContainer>
      {isInit && totalStakingState && (
        <>
          <StakingCard totalStakingState={totalStakingState} />
          {totalStakingState.delegateList.length > 0 && <DelegationCard totalStakingState={totalStakingState} />}
        </>
      )}

      {validatorsState && <ValidatorsCard validatorsState={validatorsState} />}
    </ContentContainer>
  );
};

export default React.memo(Staking);
