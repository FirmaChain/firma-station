import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useValidatorsQuery } from "apollo/gqls";
import numeral from "numeral";

import useFirma from "utils/wallet";

export const useStakingData = () => {
  const { getStaking, getStakingFromValidator } = useFirma();
  const { targetValidator } = useSelector((state) => state.wallet);

  const [validatorsState, setValidatorsState] = useState({
    totalVotingPower: 0,
    validators: [],
  });

  const [totalStakingState, setTotalStakingState] = useState({
    available: 0,
    delegated: 0,
    undelegate: 0,
    stakingReward: 0,
  });

  const [targetStakingState, setTargetStakingState] = useState({
    validatorAddress: "",
    delegated: 0,
    undelegate: 0,
    stakingReward: 0,
  });

  useInterval(() => {
    getStaking().then((result) => {
      setTotalStakingState(result);
    });

    if (targetValidator !== "") {
      getStakingFromValidator(targetValidator).then((result) => {
        setTargetStakingState(result);
      });
    }
  }, 5000);

  useValidatorsQuery({
    onCompleted: (data) => {
      const slashingParams = data.slashingParams[0].params;
      const totalVotingPower = numeral(data.stakingPool[0].bondedTokens / 1000000).value();
      const { signed_blocks_window } = slashingParams;

      const validators = data.validator.map((validator) => {
        const validatorAddress = validator.validatorInfo.operatorAddress;
        const validatorMoniker = validator.validator_descriptions[0].moniker;
        const validatorAvatar = validator.validator_descriptions[0].avatar_url;
        const validatorDetail = validator.validator_descriptions[0].details;
        const selfDelegateAddress = validator.validatorInfo.selfDelegateAddress;
        const votingPower = validator.validatorVotingPowers[0].votingPower;
        const votingPowerPercent = numeral((votingPower / totalVotingPower) * 100).format("0.00");
        const totalDelegations = validator.delegations.reduce((acc, current) => {
          return acc + numeral(current.amount.amount).value();
        }, 0);
        const [selfDelegation] = validator.delegations.filter((y) => {
          return y.delegatorAddress === validator.validatorInfo.selfDelegateAddress;
        });
        const self = numeral(selfDelegation.amount.amount).value();
        const selfPercent = numeral((self / (totalDelegations || 1)) * 100).format("0.00");
        const delegations = validator.delegations.map((value) => {
          return { address: value.delegatorAddress, amount: numeral(value.amount.amount).value() };
        });
        const missedBlockCounter = validator.validatorSigningInfos[0].missedBlocksCounter;
        const commission = numeral(validator.validatorCommissions[0].commission * 100).value();
        const condition = (1 - missedBlockCounter / signed_blocks_window) * 100;
        const status = validator.validatorStatuses[0].status;
        const jailed = validator.validatorStatuses[0].jailed;

        return {
          validatorAddress,
          validatorMoniker,
          validatorAvatar,
          validatorDetail,
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
    targetStakingState,
  };
};

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      tick();
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
