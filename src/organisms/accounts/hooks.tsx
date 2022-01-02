import { useState } from "react";
import { useSelector } from "react-redux";

import { rootState } from "../../redux/reducers";
import { useTransferHistoryByAddressQuery } from "../../apollo/gqls";
import useFirma from "../../utils/wallet";
import { convertNumber } from "../../utils/common";

export interface IHistory {
  height: number;
  hash: string;
  type: string;
  from: string;
  to: string;
  denom: string;
  amount: string;
  memo: string;
  timestamp: string;
  success: boolean;
}

export interface IToken {
  denom: string;
  symbol: string;
  decimal: number;
}

export interface ITokensState {
  [key: string]: IToken;
}

export interface ITransferHistoryByAddressState {
  historyList: Array<IHistory>;
}

export const useTransferHistoryByAddress = () => {
  const [transferHistoryByAddressState, setTransferHistoryByAddressState] = useState<ITransferHistoryByAddressState>({
    historyList: [],
  });
  const [tokenDataState, setTokenDatas] = useState<ITokensState>({});
  const { address } = useSelector((state: rootState) => state.wallet);
  const { getTokenData } = useFirma();

  const updateTokenData = async (data: any) => {
    for (let message of data.messagesByAddress) {
      const denom = message.transaction.messages[0].amount[0].denom;

      if (Object.keys(tokenDataState).includes(denom) === false) {
        try {
          const tokenData = await getTokenData(denom);

          setTokenDatas((prev) => {
            let newData = {
              ...prev,
            };

            newData[denom] = {
              denom: tokenData.denom,
              symbol: tokenData.symbol,
              decimal: convertNumber(tokenData.decimal),
            };

            return {
              ...newData,
            };
          });
        } catch (e) {
          continue;
        }
      }
    }
  };

  const formatHistoryList = (data: any) => {
    return data.messagesByAddress.map((message: any) => {
      return {
        height: message.transaction.height,
        hash: message.transaction.hash,
        type: message.transaction.messages[0]["@type"],
        from: message.transaction.messages[0].from_address,
        to: message.transaction.messages[0].to_address,
        denom: message.transaction.messages[0].amount[0].denom,
        amount: message.transaction.messages[0].amount[0].amount,
        memo: message.transaction.memo,
        timestamp: message.transaction.block.timestamp,
        success: message.transaction.success,
      };
    });
  };

  useTransferHistoryByAddressQuery({
    onCompleted: async (data) => {
      await updateTokenData(data);

      setTransferHistoryByAddressState({
        historyList: formatHistoryList(data),
      });
    },
    address: `{${address}}`,
  });

  return {
    transferHistoryByAddressState,
    tokenDataState,
  };
};
