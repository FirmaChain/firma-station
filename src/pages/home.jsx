import React from "react";
import { AccountCard, AssetCard, BlockCard, VotingPowerCard, TokenomicsCard } from "organisms/home";
import { useBlockData } from "organisms/home/hooks";
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
  const { blockState, tokenomicsState, votingPowerState } = useBlockData();

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
          <RightCardTopWrap>{blockState && <BlockCard blockState={blockState} />}</RightCardTopWrap>
          <RightCardMiddleWrap>
            {votingPowerState && <VotingPowerCard votingPowerState={votingPowerState} />}
            {tokenomicsState && <TokenomicsCard tokenomicsState={tokenomicsState} />}
          </RightCardMiddleWrap>
        </RightCardWrap>
      </CardWrap>
    </ContentContainer>
  );
};

export default React.memo(Home);
