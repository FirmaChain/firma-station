import React from "react";
import { useSelector } from "react-redux";

import { rootState } from "../redux/reducers";
import { useTransferHistoryByAddress } from "../organisms/accounts/hooks";

import { AccountCard, AssetCard, SendCard, TransferHistoryCard } from "../organisms/accounts";
import {
  ContentContainer,
  CardWrap,
  LeftCardWrap,
  RightCardWrap,
  RightCardTopWrap,
  RightCardBottomWrap,
} from "../styles/accounts";

const Accounts = () => {
  const { isInit } = useSelector((state: rootState) => state.wallet);
  const { transferHistoryByAddressState, tokenDataState } = useTransferHistoryByAddress();
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
              <TransferHistoryCard
                transferHistoryByAddressState={transferHistoryByAddressState}
                tokenDataState={tokenDataState}
              />
            )}
          </RightCardBottomWrap>
        </RightCardWrap>
      </CardWrap>
    </ContentContainer>
  );
};

export default React.memo(Accounts);
