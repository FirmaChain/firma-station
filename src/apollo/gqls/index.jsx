import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

export const useBlockDataQuery = ({ onCompleted }) => {
  return useQuery(
    gql`
      query {
        height: block(order_by: { height: desc }, limit: 1) {
          height
        }
        inflation {
          value
        }
        transactions: transaction_aggregate {
          aggregate {
            count
          }
        }
      }
    `,
    { onCompleted, pollInterval: 5000, notifyOnNetworkStatusChange: true }
  );
};

export const useVotingPowerQuery = ({ onCompleted }) => {
  return useQuery(
    gql`
      query {
        block(offset: 0, limit: 1, order_by: { height: desc }) {
          height
          validatorVotingPowersAggregate: validator_voting_powers_aggregate {
            aggregate {
              sum {
                votingPower: voting_power
              }
            }
          }
        }
        stakingPool: staking_pool(order_by: { height: desc }, limit: 1) {
          bonded: bonded_tokens
        }
      }
    `,
    { onCompleted, pollInterval: 5000, notifyOnNetworkStatusChange: true }
  );
};
