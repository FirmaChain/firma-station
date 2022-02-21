import React from "react";
import { useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";

import { rootState } from "../redux/reducers";

import { StakingCard, ValidatorsCard, DelegationCard } from "../organisms/staking";
import { useStakingData } from "../organisms/staking/hooks";
import { ContentContainer } from "../styles/staking";

const Staking = () => {
  const { isInit } = useSelector((state: rootState) => state.wallet);
  const { totalStakingState, validatorsState } = useStakingData();

  const isMobile = useMediaQuery({ query: "(min-width:0px) and (max-width:599px)" });

  return (
    <ContentContainer>
      {isInit && totalStakingState && (
        <>
          <StakingCard totalStakingState={totalStakingState} />
          {totalStakingState.delegateList.length +
            totalStakingState.redelegationList.length +
            totalStakingState.undelegationList.length >
            0 &&
            isMobile === false && <DelegationCard totalStakingState={totalStakingState} />}
        </>
      )}

      {validatorsState && <ValidatorsCard validatorsState={validatorsState} />}
    </ContentContainer>
  );
};

export default React.memo(Staking);
