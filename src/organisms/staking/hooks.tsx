import { useState, useEffect, useRef } from "react";
import numeral from "numeral";
import gql from "graphql-tag";
import { client } from "../../apollo";

import useFirma from "../../utils/wallet";
import { convertNumber, convertToFctNumber, isValid } from "../../utils/common";
import { useValidatorsQuery } from "../../apollo/gqls";
import { MINT_COIN_PER_BLOCK } from "../../config";

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

export interface ITotalStakingState {
  available: number;
  delegated: number;
  undelegate: number;
  stakingReward: number;
  stakingRewardList: Array<any>;
  delegateList: Array<IStakeInfo>;
  undelegateList: Array<IStakeInfo>;
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
  }, 2000);

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
    undelegateList: [],
  });

  useInterval(() => {
    getStaking()
      .then((result: ITotalStakingState | undefined) => {
        if (result) {
          let queryIn = "";
          for (let i = 0; i < result.delegateList.length; i++) {
            queryIn += `"${result.delegateList[i].validatorAddress}",`;
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
              setTotalStakingState(result);
            });
        }
      })
      .catch((e) => {});
  }, 2000);

  useValidatorsQuery({
    onCompleted: (data) => {
      const averageBlockTimePerDay = data.average_block_time_per_day[0].average_time;
      // BLOCK_PER_MINT_COIN
      const slashingParams = data.slashingParams[0].params;
      const totalVotingPower = convertToFctNumber(data.stakingPool[0].bondedTokens);
      const { signed_blocks_window } = slashingParams;

      const mintCoinPerDay = (86400 / averageBlockTimePerDay) * MINT_COIN_PER_BLOCK;
      const mintCoinPerYear = mintCoinPerDay * 365;

      const validatorsList = data.validator
        .filter((validator: any) => {
          return validator.validatorStatuses[0].jailed === false;
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
          const votingPower = validator.validatorVotingPowers[0].votingPower;
          const votingPowerPercent = numeral(convertNumber((votingPower / totalVotingPower) * 100)).format("0.00");
          const totalDelegations = validator.delegations.reduce((prev: number, current: any) => {
            return prev + convertNumber(current.amount.amount);
          }, 0);
          const [selfDelegation] = validator.delegations.filter((y: any) => {
            return y.delegatorAddress === validator.validatorInfo.selfDelegateAddress;
          });

          let self = 0;
          if (selfDelegation) self = convertNumber(selfDelegation.amount.amount);

          const selfPercent = numeral(convertNumber((self / (totalDelegations || 1)) * 100)).format("0.00");
          const delegations = validator.delegations.map((value: any) => {
            return { address: value.delegatorAddress, amount: convertNumber(value.amount.amount) };
          });
          const missedBlockCounter = validator.validatorSigningInfos[0].missedBlocksCounter;
          const commission = numeral(convertNumber(validator.validatorCommissions[0].commission * 100)).value();
          const condition = (1 - missedBlockCounter / signed_blocks_window) * 100;
          const status = validator.validatorStatuses[0].status;
          const jailed = validator.validatorStatuses[0].jailed;

          const rewardPerYear =
            mintCoinPerYear *
            (votingPower / totalVotingPower) *
            0.98 *
            (1 - validator.validatorCommissions[0].commission);
          const APR = rewardPerYear / votingPower;
          const APRPerDay = APR / 365;
          const APY = convertNumber(((1 + APRPerDay) ** 365 - 1).toFixed(2));

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
