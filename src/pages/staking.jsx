import React from "react";
import { ContentContainer } from "styles/staking";
import { StakingCard, Validators } from "organisms/staking";
import { useSelector } from "react-redux";

const Staking = () => {
  const { isInit } = useSelector((state) => state.wallet);
  return (
    <ContentContainer>
      {isInit && <StakingCard />}
      <Validators />
    </ContentContainer>
  );
};

export default React.memo(Staking);
