import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { rootState } from '../../redux/reducers';
import useFirma from '../../utils/wallet';
import { CHAIN_CONFIG } from '../../config';
import { convertNumber, makeDecimalPoint } from '../../utils/common';
import { getAvatarInfo, getAvatarInfoFromAcc } from '../../utils/avatar';
import {
  IDelegationState,
  IDelegateInfo,
  ITotalStakingState,
  ITargetStakingState,
  IValidatorsState,
  IValidator,
  IGrantsDataState,
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

export {
  useDelegations,
  useStakingData,
  useStakingDataFromTarget,
  useGrantData,
  useValidators,
  useValidatorFromTarget,
};

const useDelegations = () => {
  const { avatarList } = useSelector((state: rootState) => state.avatar);
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

            const { moniker, avatarURL } = getAvatarInfoFromAcc(avatarList, delegate.delegatorAddress);

            delegateList.push({
              ...delegate,
              moniker,
              avatarURL,
            });
          }

          const selfPercent = (self / totalDelegationAmount) * 100;

          setDelegateState({
            self,
            selfPercent,
            delegateList,
          });
        })
        .catch(() => {});
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    delegateState,
  };
};

const useStakingData = () => {
  const { isInit } = useSelector((state: rootState) => state.wallet);
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
    isInit &&
      getStaking()
        .then(async (result: ITotalStakingState | undefined) => {
          if (result) {
            setTotalStakingState(result);
          }
        })
        .catch(() => {});
  }, [isInit]); // eslint-disable-line react-hooks/exhaustive-deps

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

const useGrantData = () => {
  const { isInit } = useSelector((state: rootState) => state.wallet);
  const { getStakingGrantDataList } = useFirma();

  const [grantDataState, setGrantDataState] = useState<IGrantsDataState>({
    maxFCT: '0',
    expiration: '',
    allowValidatorList: [],
  });

  useEffect(() => {
    if (CHAIN_CONFIG.RESTAKE.ADDRESS) {
      getStakingGrantDataList().then((grantData) => {
        if (grantData) {
          setGrantDataState(grantData);
        }
      });
    }
  }, [isInit]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    grantDataState,
  };
};

const useValidators = () => {
  const { avatarList } = useSelector((state: rootState) => state.avatar);

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
        const mintCoinPerDay =
          (86400 / CHAIN_CONFIG.PARAMS.AVERAGE_BLOCK_TIME) *
          ((inflation * totalSupply) / CHAIN_CONFIG.PARAMS.BLOCKS_PER_YEAR);
        const mintCoinPerYear = mintCoinPerDay * 365;

        const parseValidatorList: IValidator[] = validatorList
          .filter((validator) => {
            return validator.jailed === false && validator.status === 'BOND_STATUS_BONDED';
          })
          .map((validator) => {
            const signingInfo = validatorSigningInfoList.find(
              (signingInfo: ISigningInfo) => signingInfo.address === validator.valconsAddress
            );
            const condition = signingInfo
              ? (1 - convertNumber(signingInfo.missed_blocks_counter) / signedBlocksWindow) * 100
              : 0;

            const rewardPerYear =
              mintCoinPerYear *
              (validator.votingPower / totalVotingPower) *
              (1 - CHAIN_CONFIG.PARAMS.COMMUNITY_POOL) *
              (1 - validator.commission);
            const APR = isNaN(rewardPerYear / validator.votingPower) ? 0 : rewardPerYear / validator.votingPower;
            const APY = convertNumber(makeDecimalPoint((1 + APR / 365) ** 365 - 1, 2));

            const { moniker, avatarURL } = getAvatarInfo(avatarList, validator.validatorAddress);
            const validatorMoniker = moniker;
            const validatorAvatar = avatarURL;
            const tombstoned = signingInfo ? signingInfo.tombstoned : false;

            return {
              ...validator,
              validatorMoniker,
              validatorAvatar,
              condition,
              APR,
              APY,
              tombstoned,
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
  }, [avatarList]);

  return {
    validatorsState,
  };
};

const useValidatorFromTarget = () => {
  const targetValidator = window.location.pathname.replace('/staking/validators/', '');
  const { avatarList } = useSelector((state: rootState) => state.avatar);

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
          const signingInfo = validatorSigningInfoList.find(
            (signingInfo: ISigningInfo) => signingInfo.address === validator.valconsAddress
          );
          const condition = signingInfo
            ? (1 - convertNumber(signingInfo.missed_blocks_counter) / signedBlocksWindow) * 100
            : 0;

          const mintCoinPerDay =
            (86400 / CHAIN_CONFIG.PARAMS.AVERAGE_BLOCK_TIME) *
            ((inflation * totalSupply) / CHAIN_CONFIG.PARAMS.BLOCKS_PER_YEAR);
          const mintCoinPerYear = mintCoinPerDay * 365;
          const rewardPerYear =
            mintCoinPerYear *
            (validator.votingPower / totalVotingPower) *
            (1 - CHAIN_CONFIG.PARAMS.COMMUNITY_POOL) *
            (1 - validator.commission);
          const APR = isNaN(rewardPerYear / validator.votingPower) ? 0 : rewardPerYear / validator.votingPower;
          const APY = convertNumber(makeDecimalPoint((1 + APR / 365) ** 365 - 1, 2));

          const { moniker, avatarURL } = getAvatarInfo(avatarList, validator.validatorAddress);
          const validatorMoniker = moniker;
          const validatorAvatar = avatarURL;
          const tombstoned = signingInfo ? signingInfo.tombstoned : false;

          setValidatorState({
            ...validator,
            validatorMoniker,
            validatorAvatar,
            condition,
            tombstoned,
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
