import { useState, useEffect, useRef } from "react";

import { useBlockDataQuery, useVotingPowerQuery, useTokenomicsQuery } from "apollo/gqls";

import useFirma from "utils/wallet";

export const useBlockData = () => {
  const { convertToFct, refreshWallet } = useFirma();
  const [blockState, setBlockState] = useState({
    height: 0,
    transactions: 0,
    inflation: 0,
  });

  const [votingPowerState, setVotingPowerState] = useState({
    height: 0,
    votingPower: 0,
    totalVotingPower: 0,
  });

  const [tokenomicsState, setTokenomicsState] = useState({
    delegated: 0,
    undelegated: 0,
    undelegate: 0,
  });

  useInterval(() => {
    refreshWallet();
  }, 5000);

  useBlockDataQuery({
    onCompleted: (data) => {
      setBlockState((prevState) => ({
        ...prevState,
        height: formatBlockHeight(data),
        transactions: formatTransactions(data),
        inflation: formatInflation(data),
      }));
    },
  });

  useVotingPowerQuery({
    onCompleted: (data) => {
      setVotingPowerState((prevState) => ({
        ...prevState,
        height: formatBlockHeight2(data),
        votingPower: formatVotingPower(data),
        totalVotingPower: formatTotalVotingPower(data),
      }));
    },
  });

  useTokenomicsQuery({
    onCompleted: (data) => {
      setTokenomicsState((prevState) => ({
        ...prevState,
        supply: formatSupply(data),
        delegated: formatDelegated(data),
        undelegated: formatUndelegated(data),
        undelegate: formatUndelegate(data),
      }));
    },
  });

  const formatBlockHeight = (data) => {
    return data.height[0].height;
  };

  const formatBlockHeight2 = (data) => {
    return data.block[0].height;
  };

  const formatTransactions = (data) => {
    return data.transactions.aggregate.count;
  };

  const formatInflation = (data) => {
    return (data.inflation[0].value * 100).toFixed(2) + " %";
  };

  const formatVotingPower = (data) => {
    return data.block[0].validatorVotingPowersAggregate.aggregate.sum.votingPower;
  };

  const formatTotalVotingPower = (data) => {
    return convertToFct(data.stakingPool[0].bonded);
  };

  const formatSupply = (data) => {
    return convertToFct(data.supply[0].coins[0].amount);
  };
  const formatDelegated = (data) => {
    return convertToFct(data.stakingPool[0].bonded);
  };

  const formatUndelegated = (data) => {
    return convertToFct(data.supply[0].coins[0].amount - data.stakingPool[0].bonded - data.stakingPool[0].unbonded);
  };

  const formatUndelegate = (data) => {
    return convertToFct(data.stakingPool[0].unbonded);
  };

  return {
    blockState,
    votingPowerState,
    tokenomicsState,
  };
};

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      tick();
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
