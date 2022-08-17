import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import gql from 'graphql-tag';
import { client } from '../../apollo';

import useFirma from '../../utils/wallet';
import { convertNumber } from '../../utils/common';
import { RESTAKE_API } from '../../config';

export interface IStakeInfo {
  validatorAddress: string;
  moniker: string;
  avatarURL: string;
  amount: string;
  rewards: string;
}

export interface IValidatorInfo {
  validatorAddress: string;
  moniker: string;
  avatarURL: string;
}

export interface ITotalDelegateState {
  totalDelegated: string;
  totalRewards: string;
  delegateList: Array<IStakeInfo>;
}

export interface IGrantsDataState {
  allowValidatorList: Array<IValidatorInfo>;
  maxFCT: string;
  expiration: string;
}

export interface IRestakeState {
  frequency: string;
  minimumRewards: number;
  round: number;
  feesAmount: string;
  restakeAmount: string;
  restakeCount: number;
  nextRoundDateTime: string;
}

export const useDelegationRewards = () => {
  const { getDelegationListWithReward, getStakingGrantDataList } = useFirma();

  const [grantsDataState, setGrantDataState] = useState<IGrantsDataState>({
    allowValidatorList: [],
    maxFCT: '',
    expiration: '',
  });

  const [totalDelegateState, setTotalDelegateState] = useState<ITotalDelegateState>({
    totalDelegated: '0',
    totalRewards: '0',
    delegateList: [],
  });

  useInterval(() => {
    getStakingGrantDataList()
      .then((r: any) => {
        if (r.length === 0) {
          throw new Error('DIABLED AUTH');
        }

        let queryIn = '';
        for (let i = 0; i < r[0].authorization.allow_list.address.length; i++) {
          queryIn += `"${r[0].authorization.allow_list.address[i]}",`;
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
            const allowValidatorList = r[0].authorization.allow_list.address.map((validatorAddress: any) => {
              for (let i = 0; i < data.validator.length; i++) {
                if (data.validator[i].validator_info.operator_address === validatorAddress) {
                  return {
                    validatorAddress,
                    moniker: data.validator[i].validator_descriptions[0].moniker,
                    avatarURL: data.validator[i].validator_descriptions[0].avatar_url,
                  };
                }
              }

              return {
                validatorAddress,
                moniker: validatorAddress,
                avatarURL: '',
              };
            });

            setGrantDataState({
              allowValidatorList,
              maxFCT: r[0].authorization.max_tokens ? r[0].authorization.max_tokens.amount : '',
              expiration: r[0].expiration,
            });
          })
          .catch((e) => {});
      })
      .catch((e) => {
        setGrantDataState({
          allowValidatorList: [],
          maxFCT: '',
          expiration: '',
        });
      });
    getDelegationListWithReward()
      .then((result: any) => {
        if (result) {
          let queryIn = '';
          for (let i = 0; i < result.length; i++) {
            queryIn += `"${result[i].value}",`;
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
              let totalDelegated = 0;
              let totalRewards = 0;

              let delegateList: Array<IStakeInfo> = result.map((delegate: any) => {
                let validator = {
                  validatorAddress: delegate.value,
                  moniker: delegate.value,
                  avatarURL: '',
                  amount: delegate.amount,
                  rewards: delegate.rewards,
                };

                totalDelegated += convertNumber(validator.amount);
                totalRewards += Math.ceil(convertNumber(validator.rewards.split('.')[0]));

                for (let i = 0; i < data.validator.length; i++) {
                  if (data.validator[i].validator_info.operator_address === delegate.value) {
                    validator.moniker = data.validator[i].validator_descriptions[0].moniker;
                    validator.avatarURL = data.validator[i].validator_descriptions[0].avatar_url;
                  }
                }

                return validator;
              });

              setTotalDelegateState({
                totalDelegated: totalDelegated.toString(),
                totalRewards: totalRewards.toString(),
                delegateList,
              });
            });
        }
      })
      .catch((e) => {
        setTotalDelegateState({
          totalDelegated: '0',
          totalRewards: '0',
          delegateList: [],
        });
      });
  }, 5000);

  return {
    grantsDataState,
    totalDelegateState,
  };
};

export const useRestakeState = () => {
  const [restakeState, setRestakeState] = useState<IRestakeState>({
    frequency: '',
    minimumRewards: 0,
    round: 0,
    feesAmount: '',
    restakeAmount: '',
    restakeCount: 0,
    nextRoundDateTime: '',
  });

  useInterval(() => {
    axios
      .get(`${RESTAKE_API}`)
      .then((res) => {
        setRestakeState({
          ...res.data,
        });
      })
      .catch((e) => {});
  }, 1000);
  // }, 60 * 1000 * 10);

  return {
    restakeState,
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
