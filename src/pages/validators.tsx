import React from "react";
import { useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { rootState } from "../redux/reducers";

import { ValidatorCard, DelegationCard, DelegatorsCard } from "../organisms/staking/validators";
import { useStakingData, useStakingDataFromTarget } from "../organisms/staking/hooks";
import { ContentContainer } from "../styles/validators";

const Validators = () => {
  const { isInit } = useSelector((state: rootState) => state.wallet);
  const { validatorsState } = useStakingData();
  const { targetStakingState } = useStakingDataFromTarget();

  const isMobile = useMediaQuery({ query: "(min-width:0px) and (max-width:599px)" });

  return (
    <ContentContainer>
      {targetStakingState && validatorsState && isInit && isMobile === false && (
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
