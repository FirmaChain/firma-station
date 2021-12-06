import { useState, useEffect, useRef } from "react";
import numeral from "numeral";

import useFirma from "../../utils/wallet";
import { convertNumber, convertToFctNumber, isValid } from "../../utils/common";
import { useValidatorsQuery } from "../../apollo/gqls";

export interface IValidatorsState {
  totalVotingPower: number;
  validators: Array<any>;
}

export interface IStakeInfo {
  validatorAddress: string;
  delegatorAddress: string;
  amount: number;
}

export interface ITotalStakingState {
  available: number;
  delegated: number;
  undelegate: number;
  stakingReward: number;
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
    delegateList: [],
    undelegateList: [],
  });

  useInterval(() => {
    getStaking()
      .then((result: ITotalStakingState | undefined) => {
        if (result) setTotalStakingState(result);
      })
      .catch((e) => {});
  }, 2000);

  useValidatorsQuery({
    onCompleted: (data) => {
      const slashingParams = data.slashingParams[0].params;
      const totalVotingPower = convertToFctNumber(data.stakingPool[0].bondedTokens);
      const { signed_blocks_window } = slashingParams;

      const validatorsList = data.validator.map((validator: any) => {
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
