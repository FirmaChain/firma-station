import React from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List } from "react-window";
import { Link } from "react-router-dom";
import moment from "moment";
import numeral from "numeral";
import styled from "styled-components";
import theme from "themes";
import { BlankCard } from "components/card";

import { EXPLORER_URI } from "config";

const ListWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const RowWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: nowrap;
`;

const Column = styled.div`
  width: 100%;
  & {
    flex: 1 1 100%;
    text-align: center;
  }
  &:nth-child(1) {
    flex: 1 1 300px;
  }
  &:nth-child(2) {
    flex: 1 1 800px;
  }
  &:nth-child(3) {
    flex: 1 1 800px;
  }
  &:nth-child(5) {
    flex: 1 1 300px;
  }
  &:nth-child(7) {
    flex: 1 1 800px;
  }
`;

const ItemWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: nowrap;
  border-bottom: 1px solid #444;
`;

const ItemColumn = styled(Column)`
  height: 50px;
  line-height: 50px;
  font-size: 14px;
  & > a {
    text-decoration: none !important;
    font-weight: 300 !important;
  }
  & > a:hover {
    background: none;
    font-weight: 500 !important;
  }
  &:nth-child(1) {
    font-size: 12px;
  }
  &:nth-child(2) {
    font-size: 12px;
  }
  &:nth-child(3) {
    font-size: 12px;
  }
`;

const HeaderWrapper = styled(RowWrapper)`
  height: 50px;
  line-height: 50px;
  border-bottom: 1px solid #444;
`;

const HeaderColumn = styled(Column)`
  color: #ddd;
`;

const TitleTypo = styled.div`
  color: ${({ theme }) => theme.colors.realWhite};
  height: 30px;
  line-height: 30px;
  font-size: ${({ theme }) => theme.sizes.accountCardSize1};
  margin-right: 6px;
  margin-bottom: 10px;
  float: left;
`;

const Row = ({ data, index, style }) => {
  const currentHistory = data[index];

  const getHash = (hash) => {
    return "0x" + hash.substr(0, 4) + "...";
  };

  const getAddress = (address) => {
    return address.substr(0, 16) + "...";
  };

  const getAmount = (amount) => {
    return `${numeral(currentHistory.amount / 1000000).format("0,0.000")} FCT`;
  };

  const getResult = (result) => {
    return result ? "SUCCESS" : "FAILED";
  };

  const getTimestamp = (timestamp) => {
    return moment(timestamp).format("YYYY-MM-DD HH:mm:ss");
  };

  return (
    <ItemWrapper style={style}>
      <ItemColumn>
        <Link to={{ pathname: `${EXPLORER_URI}/transactions/${currentHistory.hash}` }} target={"_blank"}>
          {getHash(currentHistory.hash)}
        </Link>
      </ItemColumn>
      <ItemColumn>
        <Link to={{ pathname: `${EXPLORER_URI}/accounts/${currentHistory.from}` }} target={"_blank"}>
          {getAddress(currentHistory.from)}
        </Link>
      </ItemColumn>
      <ItemColumn>
        <Link to={{ pathname: `${EXPLORER_URI}/accounts/${currentHistory.to}` }} target={"_blank"}>
          {getAddress(currentHistory.to)}
        </Link>
      </ItemColumn>
      <ItemColumn>{getAmount(currentHistory.amount)}</ItemColumn>
      <ItemColumn>{getResult(currentHistory.success)}</ItemColumn>
      <ItemColumn>{currentHistory.memo}</ItemColumn>
      <ItemColumn>{getTimestamp(currentHistory.timestamp)}</ItemColumn>
    </ItemWrapper>
  );
};

const TransferHistoryCard = ({ transferHistoryByAddressState }) => {
  return (
    <BlankCard bgColor={theme.colors.backgroundSideBar} height={"100%"}>
      <TitleTypo>Send History</TitleTypo>
      <ListWrapper>
        <AutoSizer>
          {({ height, width }) => (
            <>
              <HeaderWrapper style={{ width }}>
                <HeaderColumn>Hash</HeaderColumn>
                <HeaderColumn>From</HeaderColumn>
                <HeaderColumn>To</HeaderColumn>
                <HeaderColumn>Amount</HeaderColumn>
                <HeaderColumn>Result</HeaderColumn>
                <HeaderColumn>Memo</HeaderColumn>
                <HeaderColumn>Time</HeaderColumn>
              </HeaderWrapper>
              <List
                width={width}
                height={height - 50}
                itemCount={transferHistoryByAddressState.historyList.length}
                itemSize={50}
                itemData={transferHistoryByAddressState.historyList}
              >
                {Row}
              </List>
            </>
          )}
        </AutoSizer>
      </ListWrapper>
    </BlankCard>
  );
};

export default TransferHistoryCard;
