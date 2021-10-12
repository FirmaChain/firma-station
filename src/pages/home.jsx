import React from "react";
import { AccountCard, AssetCard, BlockCard, VotingPowerCard, TokenomicsCard } from "organisms/home";
import {
  ContentContainer,
  CardWrap,
  LeftCardWrap,
  RightCardWrap,
  RightCardTopWrap,
  RightCardMiddleWrap,
} from "styles/home";

import { useSelector } from "react-redux";

const Home = () => {
  const { isInit } = useSelector((state) => state.wallet);
  return (
    <ContentContainer>
      <CardWrap>
        {isInit && (
          <LeftCardWrap>
            <AccountCard />
            <AssetCard />
          </LeftCardWrap>
        )}
        <RightCardWrap>
          <RightCardTopWrap>
            <BlockCard />
          </RightCardTopWrap>
          <RightCardMiddleWrap>
            <VotingPowerCard />
            <TokenomicsCard />
          </RightCardMiddleWrap>
        </RightCardWrap>
      </CardWrap>
    </ContentContainer>
  );
};

export default React.memo(Home);
