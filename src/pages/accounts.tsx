import React from 'react';
import { useMediaQuery } from 'react-responsive';

import { AccountCard, AssetCard, SendCard, TransferHistoryCard, VestingCard } from '../organisms/accounts';
import { useTransferHistoryByAddress } from '../organisms/accounts/hooks';
import { useUserStore, useWalletStore } from '../store';
import { CardWrap, ContentContainer, LeftCardWrap, RightCardBottomWrap, RightCardTopWrap, RightCardWrap } from '../styles/accounts';

const Accounts = () => {
	const { isInit } = useWalletStore((state) => state);
	const { vesting } = useUserStore((state) => state);
	const { transferHistoryByAddressState, tokenDataState, isLoading, hasMore, loadMoreData } = useTransferHistoryByAddress();
	const isMobile = useMediaQuery({ query: '(min-width:0px) and (max-width:599px)' });

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
					{!isMobile && (
						// Update: hide send button on mobile
						<RightCardTopWrap>
							<SendCard />
						</RightCardTopWrap>
					)}
					<RightCardBottomWrap>
						{vesting && vesting.vestingPeriod.length > 0 && <VestingCard vestingState={vesting} />}
						{transferHistoryByAddressState && (
							<TransferHistoryCard
								transferHistoryByAddressState={transferHistoryByAddressState}
								tokenDataState={tokenDataState}
								isLoading={isLoading}
								hasMore={hasMore}
								loadMoreData={loadMoreData}
							/>
						)}
					</RightCardBottomWrap>
				</RightCardWrap>
			</CardWrap>
		</ContentContainer>
	);
};

export default React.memo(Accounts);
