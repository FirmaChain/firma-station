import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';

import { rootState } from '../../redux/reducers';
import { ITokensState, ITransferHistoryByAddressState } from '../../interfaces/history';
import { convertNumber } from '../../utils/common';
import { getHistoryByAddress } from '../../apollo/gqls/query';
import { getTokenData } from '../../utils/lcdQuery';
import { IBC_CONFIG } from '../../config';

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

        let denom = '';

        const type = message.transaction.messages[0]['@type'];
        if (type === '/cosmos.bank.v1beta1.MsgSend') {
          denom = message.transaction.messages[0].amount[0].denom;
        } else if (type === '/ibc.applications.transfer.v1.MsgTransfer') {
          denom = message.transaction.messages[0].token.denom;
        }

        if (Object.keys(tokenDataState).includes(denom) === false) {
          try {
            let tokenData: any = {
              denom: '',
              symbol: '',
              decimal: 0,
            };

            if (denom.includes('ibc') === true) {
              const targetIBCCoin = IBC_CONFIG[denom];

              if (targetIBCCoin) {
                tokenData.symbol = targetIBCCoin.symbol;
                tokenData.decimal = targetIBCCoin.decimal;
              }
            } else {
              tokenData = await getTokenData(denom);
              tokenData.symbol = tokenData.symbol.toUpperCase();
            }

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
            console.log(error);
            continue;
          }
        }
      }
    },
    [tokenDataState]
  );

  const formatHistoryList = useCallback((data: any) => {
    return data.messagesByAddress.map((message: any) => {
      const type = message.transaction.messages[0]['@type'];
      let denom = '';
      let amount = '';
      let from = '';
      let to = '';

      if (type === '/cosmos.bank.v1beta1.MsgSend') {
        denom = message.transaction.messages[0].amount[0].denom;
        amount = message.transaction.messages[0].amount[0].amount;
        from = message.transaction.messages[0].from_address;
        to = message.transaction.messages[0].to_address;
      } else if (type === '/ibc.applications.transfer.v1.MsgTransfer') {
        denom = message.transaction.messages[0].token.denom;
        amount = message.transaction.messages[0].token.amount;
        from = message.transaction.messages[0].sender;
        to = message.transaction.messages[0].receiver;
      }

      return {
        height: message.transaction.height,
        hash: message.transaction.hash,
        type: message.transaction.messages[0]['@type'],
        from,
        to,
        denom,
        amount,
        memo: message.transaction.memo,
        timestamp: message.transaction.block.timestamp,
        success: message.transaction.success,
      };
    });
  }, []);

  useEffect(() => {
    getHistoryByAddress(address, 'cosmos.bank.v1beta1.MsgSend,ibc.applications.transfer.v1.MsgTransfer')
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
