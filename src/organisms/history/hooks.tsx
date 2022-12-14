import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { rootState } from '../../redux/reducers';
import { IHistoryByAddressState } from '../../interfaces/history';
import { getHistoryByAddress } from '../../apollo/gqls/query';

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
        type: message.transaction.messages[0]['@type'],
        memo: message.transaction.memo,
        timestamp: message.transaction.block.timestamp,
        success: message.transaction.success,
      };
    });
  };

  useEffect(() => {
    getHistoryByAddress(address)
      .then(async (data) => {
        setHistoryByAddressState({
          historyList: formatHistoryList(data),
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    historyByAddressState,
  };
};
