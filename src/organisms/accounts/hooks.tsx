import { useState } from "react";
import { useSelector } from "react-redux";

import { rootState } from "../../redux/reducers";
import { useTransferHistoryByAddressQuery } from "../../apollo/gqls";

export interface IHistory {
  height: number;
  hash: string;
  type: string;
  from: string;
  to: string;
  amount: string;
  memo: string;
  timestamp: string;
  success: boolean;
}

export interface ITransferHistoryByAddressState {
  historyList: Array<IHistory>;
}

export const useTransferHistoryByAddress = () => {
  const [transferHistoryByAddressState, setTransferHistoryByAddressState] = useState<ITransferHistoryByAddressState>({
    historyList: [],
  });
  const { address } = useSelector((state: rootState) => state.wallet);

  useTransferHistoryByAddressQuery({
    onCompleted: (data) => {
      setTransferHistoryByAddressState({
        historyList: formatHistoryList(data),
      });
    },
    address: `{${address}}`,
  });

  const formatHistoryList = (data: any) => {
    return data.messagesByAddress.map((message: any) => {
      return {
        height: message.transaction.height,
        hash: message.transaction.hash,
        type: message.transaction.messages[0]["@type"],
        from: message.transaction.messages[0].from_address,
        to: message.transaction.messages[0].to_address,
        amount: message.transaction.messages[0].amount[0].amount,
        memo: message.transaction.memo,
        timestamp: message.transaction.block.timestamp,
        success: message.transaction.success,
      };
    });
  };

  return {
    transferHistoryByAddressState,
  };
};
