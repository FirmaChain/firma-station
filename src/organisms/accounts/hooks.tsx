import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';

import { rootState } from '../../redux/reducers';
import { ITokensState, ITransferHistoryByAddressState } from '../../interfaces/history';
import { convertNumber } from '../../utils/common';
import { getHistoryByAddress } from '../../apollo/gqls/query';
import { getTokenData } from '../../utils/lcdQuery';

export const useTransferHistoryByAddress = () => {
  const [transferHistoryByAddressState, setTransferHistoryByAddressState] = useState<ITransferHistoryByAddressState>({
    historyList: [],
  });
  const [tokenDataState, setTokenDatas] = useState<ITokensState>({});
  const { address } = useSelector((state: rootState) => state.wallet);

  const updateTokenData = useCallback(
    async (data: any) => {
      for (let message of data.messagesByAddress) {
        if (message.transaction.success === false) continue;

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
          } catch (error) {
            continue;
          }
        }
      }
    },
    [tokenDataState]
  );

  const formatHistoryList = useCallback((data: any) => {
    return data.messagesByAddress.map((message: any) => {
      return {
        height: message.transaction.height,
        hash: message.transaction.hash,
        type: message.transaction.messages[0]['@type'],
        from: message.transaction.messages[0].from_address,
        to: message.transaction.messages[0].to_address,
        denom: message.transaction.messages[0].amount[0].denom,
        amount: message.transaction.messages[0].amount[0].amount,
        memo: message.transaction.memo,
        timestamp: message.transaction.block.timestamp,
        success: message.transaction.success,
      };
    });
  }, []);

  useEffect(() => {
    getHistoryByAddress(address, 'cosmos.bank.v1beta1.MsgSend')
      .then(async (data) => {
        await updateTokenData(data);

        setTransferHistoryByAddressState({
          historyList: formatHistoryList(data),
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    transferHistoryByAddressState,
    tokenDataState,
  };
};
