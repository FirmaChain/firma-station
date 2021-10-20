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

export const useTokenomicsQuery = ({ onCompleted }) => {
  return useQuery(
    gql`
      query {
        stakingParams: staking_params(limit: 1) {
          params
        }
        stakingPool: staking_pool(order_by: { height: desc }, limit: 1) {
          bonded: bonded_tokens
          unbonded: not_bonded_tokens
        }
        supply: supply(order_by: { height: desc }, limit: 1) {
          coins
        }
      }
    `,
    { onCompleted, pollInterval: 5000, notifyOnNetworkStatusChange: true }
  );
};

export const useValidatorsQuery = ({ onCompleted }) => {
  return useQuery(
    gql`
      query {
        stakingPool: staking_pool(limit: 1, order_by: { height: desc }) {
          bondedTokens: bonded_tokens
        }
        validator {
          validatorStatuses: validator_statuses(order_by: { height: desc }, limit: 1) {
            status
            jailed
            height
          }
          validatorSigningInfos: validator_signing_infos(order_by: { height: desc }, limit: 1) {
            missedBlocksCounter: missed_blocks_counter
          }
          validatorInfo: validator_info {
            operatorAddress: operator_address
            selfDelegateAddress: self_delegate_address
          }
          validatorVotingPowers: validator_voting_powers(offset: 0, limit: 1, order_by: { height: desc }) {
            votingPower: voting_power
          }
          validatorCommissions: validator_commissions(order_by: { height: desc }, limit: 1) {
            commission
          }
          delegations {
            amount
            delegatorAddress: delegator_address
          }
          validatorSigningInfos: validator_signing_infos(order_by: { height: desc }, limit: 1) {
            missedBlocksCounter: missed_blocks_counter
          }
        }
        slashingParams: slashing_params(order_by: { height: desc }, limit: 1) {
          params
        }
      }
    `,
    { onCompleted, pollInterval: 5000, notifyOnNetworkStatusChange: true }
  );
};

export const useGovernmentQuery = ({ onCompleted }) => {
  return useQuery(
    gql`
      query {
        proposals: proposal(order_by: { id: desc }) {
          title
          proposalId: id
          status
          description
          proposalType: proposal_type
        }
      }
    `,
    { onCompleted, pollInterval: 10000, notifyOnNetworkStatusChange: true }
  );
};

export const useProposalQuery = ({ proposalId, onCompleted }) => {
  return useQuery(
    gql`
      query {
        proposal (where: {id: {_eq: ${proposalId}}}) {
          title
          description
          status
          content
          proposalId: id
          submitTime: submit_time
          depositEndTime: deposit_end_time
          votingStartTime: voting_start_time
          votingEndTime: voting_end_time
          proposalDeposits: proposal_deposits {
            amount
            depositorAddress: depositor_address
          }
        }
        govParams: gov_params (limit: 1, order_by: {height: desc}) {
          depositParams: deposit_params
          tallyParams: tally_params
          votingParams: voting_params
        }
        proposalVote: proposal_vote(where: {proposal_id: {_eq:  ${proposalId}}}) {
          option
          voterAddress: voter_address
        }
        stakingPool: staking_pool(limit: 1, order_by: { height: desc }) {
          totalVotingPower: bonded_tokens
        }
        proposalTallyResult: proposal_tally_result(where: {proposal_id: {_eq: ${proposalId}}}) {
          yes
          no
          noWithVeto: no_with_veto
          abstain
        }
      }
    `,
    { onCompleted, pollInterval: 10000, notifyOnNetworkStatusChange: true }
  );
};
