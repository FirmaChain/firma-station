import { useState } from "react";
import { useSelector } from "react-redux";
import { useTransferHistoryByAddressQuery } from "apollo/gqls";

export const useTransferHistoryByAddress = () => {
  const [transferHistoryByAddressState, setTransferHistoryByAddressState] = useState({
    historyList: [],
  });
  const { address } = useSelector((state) => state.wallet);

  useTransferHistoryByAddressQuery({
    onCompleted: (data) => {
      console.log(data);
      setTransferHistoryByAddressState({
        historyList: formatHistoryList(data),
      });
    },
    address: `{${address}}`,
  });

  const formatHistoryList = (data) => {
    return data.messagesByAddress.map((message) => {
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
