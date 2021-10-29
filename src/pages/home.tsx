import React from "react";
import { useSelector } from "react-redux";

import { rootState } from "../redux/reducers";
import { useBlockData } from "../organisms/home/hooks";

import { AccountCard, AssetCard, BlockCard, VotingPowerCard, TokenomicsCard } from "../organisms/home";
import {
  ContentContainer,
  CardWrap,
  LeftCardWrap,
  RightCardWrap,
  RightCardTopWrap,
  RightCardMiddleWrap,
} from "../styles/home";

const Home = () => {
  const { isInit } = useSelector((state: rootState) => state.wallet);
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
