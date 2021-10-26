import React from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List } from "react-window";
import { Link } from "react-router-dom";
import moment from "moment";
import styled from "styled-components";
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
    flex: 1 1 500px;
  }
  &:nth-child(4) {
    flex: 1 1 300px;
  }
  &:nth-child(5) {
    flex: 1 1 400px;
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
  & > a {
    text-decoration: none !important;
  }
  & > a:hover {
    background: none;
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

const Row = ({ data, index, style }) => {
  const currentHistory = data[index];

  const getMessageType = (type) => {
    const messageTypeArray = type.replace("Msg", "").split(".");
    return messageTypeArray.pop();
  };

  const getHash = (hash) => {
    return "0x" + hash.substr(0, 16) + "...";
  };

  const getResult = (result) => {
    return result ? "SUCCESS" : "FAILED";
  };

  const getTimestamp = (timestamp) => {
    return moment(timestamp).format("YYYY-MM-DD HH:mm:ss");
  };

  return (
    <ItemWrapper style={style}>
      <ItemColumn>{currentHistory.height}</ItemColumn>
      <ItemColumn>{getMessageType(currentHistory.type)}</ItemColumn>
      <ItemColumn>
        <Link to={{ pathname: `${EXPLORER_URI}/transactions/${currentHistory.hash}` }} target={"_blank"}>
          {getHash(currentHistory.hash)}
        </Link>
      </ItemColumn>
      <ItemColumn>{getResult(currentHistory.success)}</ItemColumn>
      <ItemColumn>{getTimestamp(currentHistory.timestamp)}</ItemColumn>
    </ItemWrapper>
  );
};

const HistoryCard = ({ historyByAddressState }) => {
  return (
    <ListWrapper>
      <AutoSizer>
        {({ height, width }) => (
          <>
            <HeaderWrapper style={{ width }}>
              <HeaderColumn>Block</HeaderColumn>
              <HeaderColumn>Type</HeaderColumn>
              <HeaderColumn>Hash</HeaderColumn>
              <HeaderColumn>Result</HeaderColumn>
              <HeaderColumn>Time</HeaderColumn>
            </HeaderWrapper>
            <List
              width={width}
              height={height - 50}
              itemCount={historyByAddressState.historyList.length}
              itemSize={50}
              itemData={historyByAddressState.historyList}
            >
              {Row}
            </List>
          </>
        )}
      </AutoSizer>
    </ListWrapper>
  );
};

export default HistoryCard;
