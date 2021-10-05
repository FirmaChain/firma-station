import { useState } from "react";

import { useBlockDataQuery } from "apollo/gqls";

export const useBlockData = () => {
  const [state, setState] = useState({
    height: 0,
    transactions: 0,
    inflation: 0,
  });

  useBlockDataQuery({
    onCompleted: (data) => {
      setState((prevState) => ({
        ...prevState,
        height: formatBlockHeight(data),
        transactions: formatTransactions(data),
        inflation: formatInflation(data),
      }));
    },
  });

  const formatBlockHeight = (data) => {
    return data.height[0].height;
  };

  const formatTransactions = (data) => {
    return data.transactions.aggregate.count;
  };

  const formatInflation = (data) => {
    return (data.inflation[0].value * 100).toFixed(2) + " %";
  };

  return {
    state,
  };
};
