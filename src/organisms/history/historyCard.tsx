import React from "react";
import moment from "moment";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List } from "react-window";
import { Link } from "react-router-dom";

import { EXPLORER_URI } from "../../config";
import { IHistoryByAddressState } from "./hooks";

import { ListWrapper, ItemWrapper, ItemColumn, HeaderWrapper, HeaderColumn } from "./styles";

interface IProps {
  historyByAddressState: IHistoryByAddressState;
}

const Row = ({ data, index, style }: any) => {
  const currentHistory = data[index];

  const getMessageType = (type: string) => {
    const messageTypeArray = type.replace("Msg", "").split(".");
    return <span style={{ color: "white" }}>{messageTypeArray.pop()}</span>;
  };

  const getHash = (hash: string) => {
    return "0x" + hash.substr(0, 16) + "...";
  };

  const getResult = (result: boolean) => {
    return result ? "SUCCESS" : "FAILED";
  };

  const getTimestamp = (timestamp: string) => {
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

const HistoryCard = ({ historyByAddressState }: IProps) => {
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

export default React.memo(HistoryCard);
