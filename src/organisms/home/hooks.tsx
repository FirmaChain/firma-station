import { useState, useEffect } from 'react';

import { getStakingPool, getTotalSupply, getLatestBlock, getInflation } from '../../utils/lcdQuery';
import { getTransactionCount } from '../../apollo/gqls/query';
import { convertNumberFormat } from '../../utils/common';
import { IBlockState, ITokenomicsState, IVotingPowerState } from '../../interfaces/home';

export const useDashboard = () => {
  const [blockState, setBlockState] = useState<IBlockState>({
    height: 0,
    transactions: 0,
    inflation: '0 %',
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

  useEffect(() => {
    Promise.all([getLatestBlock(), getInflation(), getTotalSupply(), getStakingPool()])
      .then(([latestBlock, inflation, totalSupply, stakingPool]) => {
        setBlockState({
          height: latestBlock,
          transactions: 0,
          inflation: `${convertNumberFormat(inflation * 100, 2)} %`,
        });

        setVotingPowerState({
          height: latestBlock,
          votingPower: stakingPool.bondedTokens,
          totalVotingPower: stakingPool.bondedTokens,
        });

        setTokenomicsState({
          supply: totalSupply,
          delegated: stakingPool.bondedTokens,
          undelegated: totalSupply - (stakingPool.bondedTokens + stakingPool.unbondedTokens),
          undelegate: stakingPool.unbondedTokens,
        });

        getTransactionCount().then((count) => {
          setBlockState((prevState) => ({ ...prevState, transactions: count }));
        });
      })
      .catch((error) => {});
  }, []);

  return {
    blockState,
    votingPowerState,
    tokenomicsState,
  };
};
