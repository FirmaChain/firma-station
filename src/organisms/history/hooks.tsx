import { useState } from "react";
import { useSelector } from "react-redux";

import { rootState } from "../../redux/reducers";
import { useHistoryByAddressQuery } from "../../apollo/gqls";

export interface IHistory {
  height: number;
  hash: string;
  type: string;
  timestamp: string;
  success: boolean;
}

export interface IHistoryByAddressState {
  historyList: Array<IHistory>;
}

export const useHistoryByAddress = () => {
  const [historyByAddressState, setHistoryByAddressState] = useState<IHistoryByAddressState>({
    historyList: [],
  });
  const { address } = useSelector((state: rootState) => state.wallet);

  const formatHistoryList = (data: any) => {
    return data.messagesByAddress.map((message: any) => {
      return {
        height: message.transaction.height,
        hash: message.transaction.hash,
        type: message.transaction.messages[0]["@type"],
        memo: message.transaction.memo,
        timestamp: message.transaction.block.timestamp,
        success: message.transaction.success,
      };
    });
  };

  useHistoryByAddressQuery({
    onCompleted: (data) => {
      setHistoryByAddressState({
        historyList: formatHistoryList(data),
      });
    },
    address: `{${address}}`,
  });

  return {
    historyByAddressState,
  };
};
