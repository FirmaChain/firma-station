import React from 'react';

import { AccountCard, AssetCard, BlockCard, TokenomicsCard, VotingPowerCard } from '../organisms/home';
import { useDashboard } from '../organisms/home/hooks';
import { useWalletStore } from '../store';
import { CardWrap, ContentContainer, LeftCardWrap, RightCardMiddleWrap, RightCardTopWrap, RightCardWrap } from '../styles/home';

const Home = () => {
	const { isInit } = useWalletStore((state) => state);
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
