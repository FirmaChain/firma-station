import { useState } from "react";

import { useBlockDataQuery, useVotingPowerQuery, useTokenomicsQuery } from "apollo/gqls";

import useFirma from "utils/firma";

export const useBlockData = () => {
  const { convertToFct } = useFirma();
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
    bonded: 0,
    unbonded: 0,
    unbonding: 0,
  });

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
        bonded: formatBonded(data),
        unbonded: formatUnbonded(data),
        unbonding: formatUnBonding(data),
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
  const formatBonded = (data) => {
    return convertToFct(data.stakingPool[0].bonded);
  };

  const formatUnbonded = (data) => {
    return convertToFct(data.supply[0].coins[0].amount - data.stakingPool[0].bonded - data.stakingPool[0].unbonded);
  };

  const formatUnBonding = (data) => {
    return convertToFct(data.stakingPool[0].unbonded);
  };

  return {
    blockState,
    votingPowerState,
    tokenomicsState,
  };
};
