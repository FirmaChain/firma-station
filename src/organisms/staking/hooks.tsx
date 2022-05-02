import { useState, useEffect, useRef } from "react";
import gql from "graphql-tag";
import { client } from "../../apollo";

import useFirma from "../../utils/wallet";
import { BLOCKS_PER_YEAR } from "../../config";
import { convertNumber, convertToFctNumber, isValid, convertNumberFormat, makeDecimalPoint } from "../../utils/common";
import { useValidatorsQuery } from "../../apollo/gqls";

export interface IValidatorsState {
  totalVotingPower: number;
  validators: Array<any>;
}

export interface IStakeInfo {
  validatorAddress: string;
  delegatorAddress: string;
  moniker: string;
  avatarURL: string;
  amount: number;
}

export interface IUndelegationList {
  validatorAddress: string;
  moniker: string;
  avatarURL: string;
  balance: string;
  completionTime: string;
}

export interface IRedelegationList {
  srcAddress: string;
  srcMoniker: string;
  srcAvatarURL: string;
  dstAddress: string;
  dstMoniker: string;
  dstAvatarURL: string;
  balance: string;
  completionTime: string;
}

export interface ITotalStakingState {
  available: number;
  delegated: number;
  undelegate: number;
  stakingReward: number;
  stakingRewardList: Array<any>;
  delegateList: Array<IStakeInfo>;
  redelegationList: Array<IRedelegationList>;
  undelegationList: Array<IUndelegationList>;
}

export interface ITargetStakingState {
  available: number;
  delegated: number;
  undelegate: number;
  stakingReward: number;
}

export const useStakingDataFromTarget = () => {
  const { getStakingFromValidator } = useFirma();
  const targetValidator = window.location.pathname.replace("/staking/validators/", "");

  const [targetStakingState, setTargetStakingState] = useState<ITargetStakingState>({
    available: 0,
    delegated: 0,
    undelegate: 0,
    stakingReward: 0,
  });

  useInterval(() => {
    if (targetValidator !== "") {
      getStakingFromValidator(targetValidator)
        .then((result: ITargetStakingState | undefined) => {
          if (result) setTargetStakingState(result);
        })
        .catch((e) => {});
    }
  }, 5000);

  return {
    targetStakingState,
  };
};

export const useStakingData = () => {
  const { getStaking } = useFirma();

  const [validatorsState, setValidatorsState] = useState<IValidatorsState>({
    totalVotingPower: 0,
    validators: [],
  });

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

  useInterval(() => {
    getStaking()
      .then((result: ITotalStakingState | undefined) => {
        if (result) {
          let queryIn = "";
          for (let i = 0; i < result.delegateList.length; i++) {
            queryIn += `"${result.delegateList[i].validatorAddress}",`;
          }
          for (let i = 0; i < result.redelegationList.length; i++) {
            queryIn += `"${result.redelegationList[i].srcAddress}",`;
            queryIn += `"${result.redelegationList[i].dstAddress}",`;
          }
          for (let i = 0; i < result.undelegationList.length; i++) {
            queryIn += `"${result.undelegationList[i].validatorAddress}",`;
          }

          client
            .query({
              query: gql`
                query {
                  validator(
                    where: {
                      validator_info: {
                        operator_address: { _in: [${queryIn}] }
                      }
                    }
                  ) {
                    validator_descriptions {
                      avatar_url
                      moniker
                    }
                    validator_info {
                      operator_address
                    }
                  }
                }
              `,
            })
            .then(({ data }) => {
              result.delegateList = result.delegateList.map((delegate) => {
                for (let i = 0; i < data.validator.length; i++) {
                  if (data.validator[i].validator_info.operator_address === delegate.validatorAddress) {
                    delegate.moniker = data.validator[i].validator_descriptions[0].moniker;
                    delegate.avatarURL = data.validator[i].validator_descriptions[0].avatar_url;
                  }
                }
                return delegate;
              });

              result.redelegationList = result.redelegationList.map((delegate) => {
                for (let i = 0; i < data.validator.length; i++) {
                  if (data.validator[i].validator_info.operator_address === delegate.srcAddress) {
                    delegate.srcMoniker = data.validator[i].validator_descriptions[0].moniker;
                    delegate.srcAvatarURL = data.validator[i].validator_descriptions[0].avatar_url;
                  }

                  if (data.validator[i].validator_info.operator_address === delegate.dstAddress) {
                    delegate.dstMoniker = data.validator[i].validator_descriptions[0].moniker;
                    delegate.dstAvatarURL = data.validator[i].validator_descriptions[0].avatar_url;
                  }
                }
                return delegate;
              });

              result.undelegationList = result.undelegationList.map((delegate) => {
                for (let i = 0; i < data.validator.length; i++) {
                  if (data.validator[i].validator_info.operator_address === delegate.validatorAddress) {
                    delegate.moniker = data.validator[i].validator_descriptions[0].moniker;
                    delegate.avatarURL = data.validator[i].validator_descriptions[0].avatar_url;
                  }
                }
                return delegate;
              });

              setTotalStakingState(result);
            });
        }
      })
      .catch((e) => {});
  }, 5000);

  useValidatorsQuery({
    onCompleted: (data) => {
      if (data.inflation.length === 0) return;

      const averageBlockTimePerDay =
        data.average_block_time_per_day.length > 0 ? data.average_block_time_per_day[0].average_time : 0;
      const averageBlockTimePerHour =
        data.average_block_time_per_hour.length > 0 ? data.average_block_time_per_hour[0].average_time : 0;
      const averageBlockTimePerMinute =
        data.average_block_time_per_minute.length > 0 ? data.average_block_time_per_minute[0].average_time : 0;

      let averageBlockTime = 0;
      if (averageBlockTimePerDay !== 0) {
        averageBlockTime = averageBlockTimePerDay;
      } else if (averageBlockTimePerHour !== 0) {
        averageBlockTime = averageBlockTimePerHour;
      } else if (averageBlockTimePerMinute !== 0) {
        averageBlockTime = averageBlockTimePerMinute;
      }

      // BLOCK_PER_MINT_COIN
      const slashingParams = data.slashingParams[0].params;
      const totalVotingPower = convertToFctNumber(data.stakingPool[0].bondedTokens);
      const { signed_blocks_window } = slashingParams;

      const inflation = convertNumber(data.inflation[0].value);
      const totalSupply = convertToFctNumber(data.supply[0].coins.filter((v: any) => v.denom === "ufct")[0].amount);

      const mintCoinPerDay = (86400 / averageBlockTime) * ((inflation * totalSupply) / BLOCKS_PER_YEAR);
      const mintCoinPerYear = mintCoinPerDay * 365;

      const validatorsList = data.validator
        .filter((validator: any) => {
          return (
            validator.validatorStatuses[0].jailed === false &&
            validator.validatorStatuses[0].status === 3 &&
            validator.validatorSigningInfos.length !== 0 &&
            validator.validatorSigningInfos[0].tombstoned === false
          );
        })
        .map((validator: any) => {
          const validatorAddress = validator.validatorInfo.operatorAddress;

          let validatorMoniker = "";
          let validatorAvatar = "";
          let validatorDetail = "";
          let validatorWebsite = "";

          if (isValid(validator.validator_descriptions[0])) {
            validatorMoniker = validator.validator_descriptions[0].moniker;
            validatorAvatar = validator.validator_descriptions[0].avatar_url;
            validatorDetail = validator.validator_descriptions[0].details;
            validatorWebsite = validator.validator_descriptions[0].website;
          }

          const selfDelegateAddress = validator.validatorInfo.selfDelegateAddress;
          const votingPower =
            validator.validatorVotingPowers.length === 0 ? 0 : validator.validatorVotingPowers[0].votingPower;
          const votingPowerPercent = convertNumberFormat(convertNumber((votingPower / totalVotingPower) * 100), 2);
          const totalDelegations = validator.delegations.reduce((prev: number, current: any) => {
            return prev + convertNumber(current.amount.amount);
          }, 0);
          const [selfDelegation] = validator.delegations.filter((y: any) => {
            return y.delegatorAddress === validator.validatorInfo.selfDelegateAddress;
          });

          let self = 0;
          if (selfDelegation) self = convertNumber(selfDelegation.amount.amount);

          const selfPercent = convertNumberFormat(convertNumber((self / (totalDelegations || 1)) * 100), 2);
          const delegations = validator.delegations.map((value: any) => {
            return { address: value.delegatorAddress, amount: convertNumber(value.amount.amount) };
          });
          const missedBlockCounter =
            validator.validatorSigningInfos.length === 0 ? 0 : validator.validatorSigningInfos[0].missedBlocksCounter;
          const commission = convertNumber(validator.validatorCommissions[0].commission * 100);
          const condition = (1 - missedBlockCounter / signed_blocks_window) * 100;
          const status = validator.validatorStatuses[0].status;
          const jailed = validator.validatorStatuses[0].jailed;

          const rewardPerYear =
            mintCoinPerYear *
            (votingPower / totalVotingPower) *
            0.98 *
            (1 - validator.validatorCommissions[0].commission);
          const APR = isNaN(rewardPerYear / votingPower) ? 0 : rewardPerYear / votingPower;
          const APRPerDay = APR / 365;
          const APY = convertNumber(makeDecimalPoint((1 + APRPerDay) ** 365 - 1, 2));

          return {
            validatorAddress,
            validatorMoniker,
            validatorAvatar,
            validatorDetail,
            validatorWebsite,
            selfDelegateAddress,
            votingPower,
            votingPowerPercent,
            commission,
            self,
            selfPercent,
            delegations,
            condition,
            status,
            jailed,
            APR,
            APY,
          };
        });

      const validators = validatorsList.sort((a: any, b: any) => b.votingPower - a.votingPower);

      setValidatorsState((prevState) => ({
        ...prevState,
        totalVotingPower,
        validators,
      }));
    },
  });

  return {
    validatorsState,
    totalStakingState,
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
