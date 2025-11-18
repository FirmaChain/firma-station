import { useState, useEffect, useRef } from 'react';

import { getStakingPool, getTotalSupply, getLatestBlock, getInflation } from '../../utils/lcdQuery';
import { getTransactionCount } from '../../apollo/gqls/query';
import { convertNumberFormat } from '../../utils/common';
import { IBlockState, ITokenomicsState, IVotingPowerState } from '../../interfaces/home';

export const useDashboard = () => {
  const [blockState, setBlockState] = useState<IBlockState>({
    height: 0,
    transactions: 0,
    inflation: '0 %'
  });

  const [votingPowerState, setVotingPowerState] = useState<IVotingPowerState>({
    height: 0,
    votingPower: 0,
    totalVotingPower: 0
  });

  const [tokenomicsState, setTokenomicsState] = useState<ITokenomicsState>({
    supply: 0,
    delegated: 0,
    undelegated: 0,
    undelegate: 0
  });

  useEffect(() => {
    getTransactionCount().then((count) => {
      setBlockState((prevState) => ({ ...prevState, transactions: count }));
    });
  }, []);

  useInterval(() => {
    Promise.all([getLatestBlock(), getInflation(), getTotalSupply(), getStakingPool()])
      .then(([latestBlock, inflation, totalSupply, stakingPool]) => {
        setBlockState((prevState) => ({
          ...prevState,
          height: latestBlock,
          inflation: `${convertNumberFormat(inflation * 100, 2)} %`
        }));

        setVotingPowerState({
          height: latestBlock,
          votingPower: stakingPool.bondedTokens,
          totalVotingPower: stakingPool.bondedTokens
        });

        setTokenomicsState({
          supply: totalSupply,
          delegated: stakingPool.bondedTokens,
          undelegated: totalSupply - (stakingPool.bondedTokens + stakingPool.unbondedTokens),
          undelegate: stakingPool.unbondedTokens
        });
      })
      .catch(() => {});
  }, 5000);

  return {
    blockState,
    votingPowerState,
    tokenomicsState
  };
};

const useInterval = (callback: () => void, delay: number) => {
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
};
