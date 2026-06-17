import React from 'react';
import { useSelector } from 'react-redux';

import { AccountCard, AssetCard, BlockCard, TokenomicsCard, VotingPowerCard } from '../organisms/home';
import { useDashboard } from '../organisms/home/hooks';
import { rootState } from '../redux/reducers';
import { CardWrap, ContentContainer, LeftCardWrap, RightCardMiddleWrap, RightCardTopWrap, RightCardWrap } from '../styles/home';

const Home = () => {
	const { isInit } = useSelector((state: rootState) => state.wallet);
	const { blockState, tokenomicsState, votingPowerState } = useDashboard();

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
						<BlockCard blockState={blockState} />
					</RightCardTopWrap>
					<RightCardMiddleWrap>
						<VotingPowerCard votingPowerState={votingPowerState} />
						<TokenomicsCard tokenomicsState={tokenomicsState} />
					</RightCardMiddleWrap>
				</RightCardWrap>
			</CardWrap>
		</ContentContainer>
	);
};

export default React.memo(Home);
