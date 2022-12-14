import { useState, useEffect } from 'react';

import useFirma from '../../utils/wallet';
import { AVERAGE_BLOCK_TIME, BLOCKS_PER_YEAR, COMMUNITY_POOL } from '../../config';
import { convertNumber, makeDecimalPoint } from '../../utils/common';
import {
  IDelegationState,
  IDelegateInfo,
  ITotalStakingState,
  ITargetStakingState,
  IValidatorsState,
  IValidator,
} from '../../interfaces/staking';
import { ISigningInfo, IValidatorData } from '../../interfaces/lcd';

import {
  getValidatorList,
  getInflation,
  getTotalSupply,
  getTotalVotingPower,
  getSignedBlocksWindow,
  getValidatorFromAddress,
  getValidatorDelegationsFromAddress,
  getAccAddressFromValOperAddress,
  getSigningInfos,
} from '../../utils/lcdQuery';

export { useDelegations, useStakingData, useStakingDataFromTarget, useValidators, useValidatorFromTarget };

const useDelegations = () => {
  const targetValidator = window.location.pathname.replace('/staking/validators/', '');

  const [delegateState, setDelegateState] = useState<IDelegationState>({
    self: 0,
    selfPercent: 0,
    delegateList: [],
  });

  useEffect(() => {
    if (targetValidator !== '') {
      const selfDelegateAddress = getAccAddressFromValOperAddress(targetValidator);

      getValidatorDelegationsFromAddress(targetValidator)
        .then(async (result) => {
          let self = 0;
          let totalDelegationAmount = 0;
          let delegateList: IDelegateInfo[] = [];

          for (const delegate of result) {
            totalDelegationAmount += delegate.amount;
            if (delegate.delegatorAddress === selfDelegateAddress) {
              self = delegate.amount;
            }

            delegateList.push(delegate);
          }

          const selfPercent = (self / totalDelegationAmount) * 100;

          setDelegateState({
            self,
            selfPercent,
            delegateList,
          });
        })
        .catch((error) => {});
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    delegateState,
  };
};

const useStakingData = () => {
  const { getStaking } = useFirma();

  const [totalStakingState, setTotalStakingState] = useState<ITotalStakingState>({
    available: 0,
    delegated: 0,
    undelegate: 0,
    stakingReward: 0,
    stakingRewardList: [],
    delegateList: [],
    redelegationList: [],
    undelegationList: [],
  });

  useEffect(() => {
    getStaking()
      .then(async (result: ITotalStakingState | undefined) => {
        if (result) {
          setTotalStakingState(result);
        }
      })
      .catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    totalStakingState,
  };
};

const useStakingDataFromTarget = () => {
  const { getStakingFromValidator } = useFirma();
  const targetValidator = window.location.pathname.replace('/staking/validators/', '');

  const [targetStakingState, setTargetStakingState] = useState<ITargetStakingState>({
    available: 0,
    delegated: 0,
    undelegate: 0,
    stakingReward: 0,
  });

  useEffect(() => {
    if (targetValidator !== '') {
      getStakingFromValidator(targetValidator)
        .then((result: ITargetStakingState | undefined) => {
          if (result) setTargetStakingState(result);
        })
        .catch((e) => {});
    }
  }, [targetValidator]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    targetStakingState,
  };
};

const useValidators = () => {
  const [validatorsState, setValidatorsState] = useState<IValidatorsState>({
    totalVotingPower: 0,
    validators: [],
  });

  useEffect(() => {
    getValidatorList()
      .then(async (validatorList: IValidatorData[]) => {
        const [totalSupply, inflation, totalVotingPower, signedBlocksWindow]: any = await Promise.all([
          getTotalSupply(),
          getInflation(),
          getTotalVotingPower(),
          getSignedBlocksWindow(),
        ]);

        const validatorSigningInfoList = await getSigningInfos();
        const mintCoinPerDay = (86400 / AVERAGE_BLOCK_TIME) * ((inflation * totalSupply) / BLOCKS_PER_YEAR);
        const mintCoinPerYear = mintCoinPerDay * 365;

        const parseValidatorList: IValidator[] = validatorList
          .filter((validator) => {
            return validator.jailed === false && validator.status === 'BOND_STATUS_BONDED';
          })
          .map((validator) => {
            const missedBlockCounter = validatorSigningInfoList.find(
              (signingInfo: ISigningInfo) => signingInfo.address === validator.valconsAddress
            );
            const condition = missedBlockCounter
              ? (1 - convertNumber(missedBlockCounter.missed_blocks_counter) / signedBlocksWindow) * 100
              : 0;

            const rewardPerYear =
              mintCoinPerYear *
              (validator.votingPower / totalVotingPower) *
              (1 - COMMUNITY_POOL) *
              (1 - validator.commission);
            const APR = isNaN(rewardPerYear / validator.votingPower) ? 0 : rewardPerYear / validator.votingPower;
            const APY = convertNumber(makeDecimalPoint((1 + APR / 365) ** 365 - 1, 2));

            return {
              ...validator,
              condition,
              APR,
              APY,
              tombstoned: false,
            };
          });

        parseValidatorList.sort((a: any, b: any) => b.votingPower - a.votingPower);

        setValidatorsState({
          totalVotingPower,
          validators: parseValidatorList,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    validatorsState,
  };
};

const useValidatorFromTarget = () => {
  const targetValidator = window.location.pathname.replace('/staking/validators/', '');

  const [validatorState, setValidatorState] = useState<IValidator>({
    validatorAddress: '',
    validatorMoniker: '',
    validatorAvatar: '',
    validatorDetail: '',
    validatorWebsite: '',
    selfDelegateAddress: '',
    votingPower: 0,
    votingPowerPercent: '',
    commission: 0,
    condition: 0,
    status: '',
    jailed: false,
    APR: 0,
    APY: 0,
    tombstoned: false,
  });

  useEffect(() => {
    getValidatorFromAddress(targetValidator)
      .then(async (validator: IValidatorData) => {
        try {
          const [totalSupply, inflation, totalVotingPower, signedBlocksWindow]: any = await Promise.all([
            getTotalSupply(),
            getInflation(),
            getTotalVotingPower(),
            getSignedBlocksWindow(),
          ]);

          const validatorSigningInfoList = await getSigningInfos();
          const missedBlockCounter = validatorSigningInfoList.find(
            (signingInfo: ISigningInfo) => signingInfo.address === validator.valconsAddress
          );
          const condition = missedBlockCounter
            ? (1 - convertNumber(missedBlockCounter.missed_blocks_counter) / signedBlocksWindow) * 100
            : 0;

          const mintCoinPerDay = (86400 / AVERAGE_BLOCK_TIME) * ((inflation * totalSupply) / BLOCKS_PER_YEAR);
          const mintCoinPerYear = mintCoinPerDay * 365;
          const rewardPerYear =
            mintCoinPerYear *
            (validator.votingPower / totalVotingPower) *
            (1 - COMMUNITY_POOL) *
            (1 - validator.commission);
          const APR = isNaN(rewardPerYear / validator.votingPower) ? 0 : rewardPerYear / validator.votingPower;
          const APY = convertNumber(makeDecimalPoint((1 + APR / 365) ** 365 - 1, 2));

          setValidatorState({
            ...validator,
            condition,
            tombstoned: false,
            APR,
            APY,
          });
        } catch (error) {
          setValidatorState({
            ...validator,
            condition: null,
            tombstoned: false,
            APR: null,
            APY: null,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    validatorState,
  };
};
