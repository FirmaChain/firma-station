import { useState } from "react";

import { convertNumberFormat, convertToFctNumber } from "../../utils/common";
import { useBlockDataQuery, useVotingPowerQuery, useTokenomicsQuery } from "../../apollo/gqls";

export interface IBlockState {
  height: number;
  transactions: number;
  inflation: string;
}

export interface IVotingPowerState {
  height: number;
  votingPower: number;
  totalVotingPower: number;
}

export interface ITokenomicsState {
  supply: number;
  delegated: number;
  undelegated: number;
  undelegate: number;
}

export const useBlockData = () => {
  const [blockState, setBlockState] = useState<IBlockState>({
    height: 0,
    transactions: 0,
    inflation: "0 %",
  });

  const [votingPowerState, setVotingPowerState] = useState<IVotingPowerState>({
    height: 0,
    votingPower: 0,
    totalVotingPower: 0,
  });

  const [tokenomicsState, setTokenomicsState] = useState<ITokenomicsState>({
    supply: 0,
    delegated: 0,
    undelegated: 0,
    undelegate: 0,
  });

  const formatBlockHeight = (data: any) => {
    return data.height.length > 0 ? data.height[0].height : 0;
  };

  const formatBlockHeight2 = (data: any) => {
    return data.block.length > 0 ? data.block[0].height : 0;
  };

  const formatTransactions = (data: any) => {
    return data.transactions.aggregate.count;
  };

  const formatInflation = (data: any) => {
    return data.inflation.length > 0 ? convertNumberFormat(data.inflation[0].value * 100, 2) + " %" : "0 %";
  };

  const formatVotingPower = (data: any) => {
    return data.block[0].validatorVotingPowersAggregate.aggregate.sum.votingPower;
  };

  const formatTotalVotingPower = (data: any) => {
    return data.stakingPool.length > 0 ? convertToFctNumber(data.stakingPool[0].bonded) : 0;
  };

  const formatSupply = (data: any) => {
    return data.supply.length > 0
      ? convertToFctNumber(data.supply[0].coins.filter((v: any) => v.denom === "ufct")[0].amount)
      : 0;
  };
  const formatDelegated = (data: any) => {
    return data.stakingPool.length > 0 ? convertToFctNumber(data.stakingPool[0].bonded) : 0;
  };

  const formatUndelegated = (data: any) => {
    return data.supply.length > 0
      ? convertToFctNumber(
          data.supply[0].coins.filter((v: any) => v.denom === "ufct")[0].amount -
            data.stakingPool[0].bonded -
            data.stakingPool[0].unbonded
        )
      : 0;
  };

  const formatUndelegate = (data: any) => {
    return data.stakingPool.length > 0 ? convertToFctNumber(data.stakingPool[0].unbonded) : 0;
  };

  useBlockDataQuery({
    onCompleted: (data) => {
      setBlockState({
        height: formatBlockHeight(data),
        transactions: formatTransactions(data),
        inflation: formatInflation(data),
      });
    },
  });

  useVotingPowerQuery({
    onCompleted: (data) => {
      if (data.block.length === 0) return;
      if (data.block[0].validatorVotingPowersAggregate.aggregate.sum.votingPower <= 0) return;

      setVotingPowerState({
        height: formatBlockHeight2(data),
        votingPower: formatVotingPower(data),
        totalVotingPower: formatTotalVotingPower(data),
      });
    },
  });

  useTokenomicsQuery({
    onCompleted: (data) => {
      setTokenomicsState({
        supply: formatSupply(data),
        delegated: formatDelegated(data),
        undelegated: formatUndelegated(data),
        undelegate: formatUndelegate(data),
      });
    },
  });

  return {
    blockState,
    votingPowerState,
    tokenomicsState,
  };
};
