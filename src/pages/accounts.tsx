import React from 'react';
import { useSelector } from 'react-redux';

import { rootState } from '../redux/reducers';
import { useTransferHistoryByAddress } from '../organisms/accounts/hooks';

import { AccountCard, AssetCard, SendCard, TransferHistoryCard, VestingCard } from '../organisms/accounts';
import {
  ContentContainer,
  CardWrap,
  LeftCardWrap,
  RightCardWrap,
  RightCardTopWrap,
  RightCardBottomWrap
} from '../styles/accounts';
import { useMediaQuery } from 'react-responsive';

const Accounts = () => {
  const { isInit } = useSelector((state: rootState) => state.wallet);
  const { vesting } = useSelector((state: rootState) => state.user);
  const { transferHistoryByAddressState, tokenDataState, isLoading, hasMore, loadMoreData } =
    useTransferHistoryByAddress();
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
