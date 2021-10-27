import React from "react";
import { useSelector } from "react-redux";

import { AccountCard, AssetCard, SendCard, TransferHistoryCard } from "organisms/accounts";
import { useTransferHistoryByAddress } from "organisms/accounts/hooks";
import {
  ContentContainer,
  CardWrap,
  LeftCardWrap,
  RightCardWrap,
  RightCardTopWrap,
  RightCardBottomWrap,
} from "styles/accounts";

const Accounts = () => {
  const { isInit } = useSelector((state) => state.wallet);
  const { transferHistoryByAddressState } = useTransferHistoryByAddress();
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
            <SendCard />
          </RightCardTopWrap>
          <RightCardBottomWrap>
            {transferHistoryByAddressState && (
              <TransferHistoryCard transferHistoryByAddressState={transferHistoryByAddressState} />
            )}
          </RightCardBottomWrap>
        </RightCardWrap>
      </CardWrap>
    </ContentContainer>
  );
};

export default React.memo(Accounts);
