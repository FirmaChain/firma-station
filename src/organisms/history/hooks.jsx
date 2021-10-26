import { useState } from "react";
import { useSelector } from "react-redux";
import { useHistoryByAddressQuery } from "apollo/gqls";

export const useHistoryByAddress = () => {
  const [historyByAddressState, setHistoryByAddressState] = useState({
    historyList: [],
  });
  const { address } = useSelector((state) => state.wallet);

  useHistoryByAddressQuery({
    onCompleted: (data) => {
      console.log(formatHistoryList(data));
      setHistoryByAddressState({
        historyList: formatHistoryList(data),
      });
    },
    address: `{${address}}`,
  });

  const formatHistoryList = (data) => {
    return data.messagesByAddress.map((message, index) => {
      return {
        height: message.transaction.height,
        hash: message.transaction.hash,
        type: message.transaction.messages[0]["@type"],
        timestamp: message.transaction.block.timestamp,
        success: message.transaction.success,
      };
    });
  };

  return {
    historyByAddressState,
  };
};
