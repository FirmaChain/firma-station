import { useState, useEffect, useRef } from "react";

import useFirma from "../../utils/wallet";
import { convertToFctNumber } from "../../utils/common";
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
  const { setUserData } = useFirma();
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
    return data.height[0].height;
  };

  const formatBlockHeight2 = (data: any) => {
    return data.block[0].height;
  };

  const formatTransactions = (data: any) => {
    return data.transactions.aggregate.count;
  };

  const formatInflation = (data: any) => {
    return (data.inflation[0].value * 100).toFixed(2) + " %";
  };

  const formatVotingPower = (data: any) => {
    return data.block[0].validatorVotingPowersAggregate.aggregate.sum.votingPower;
  };

  const formatTotalVotingPower = (data: any) => {
    return convertToFctNumber(data.stakingPool[0].bonded);
  };

  const formatSupply = (data: any) => {
    return convertToFctNumber(data.supply[0].coins.filter((v: any) => v.denom === "ufct")[0].amount);
  };
  const formatDelegated = (data: any) => {
    return convertToFctNumber(data.stakingPool[0].bonded);
  };

  const formatUndelegated = (data: any) => {
    return convertToFctNumber(
      data.supply[0].coins.filter((v: any) => v.denom === "ufct")[0].amount -
        data.stakingPool[0].bonded -
        data.stakingPool[0].unbonded
    );
  };

  const formatUndelegate = (data: any) => {
    return convertToFctNumber(data.stakingPool[0].unbonded);
  };

  useInterval(() => {
    setUserData();
  }, 2000);

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

function useInterval(callback: () => void, delay: number) {
  const savedCallback = useRef<() => void>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      if (savedCallback.current) savedCallback.current();
    }
    if (delay !== null) {
      tick();
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
