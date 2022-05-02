import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

interface IQueryParam {
  onCompleted: (data: any) => void;
  proposalId?: string;
  address?: string;
}

export const useBlockDataQuery = ({ onCompleted }: IQueryParam) => {
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

export const useVotingPowerQuery = ({ onCompleted }: IQueryParam) => {
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

export const useTokenomicsQuery = ({ onCompleted }: IQueryParam) => {
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

export const useValidatorsQuery = ({ onCompleted }: IQueryParam) => {
  return useQuery(
    gql`
      query {
        stakingPool: staking_pool(limit: 1, order_by: { height: desc }) {
          bondedTokens: bonded_tokens
        }
        supply: supply(order_by: { height: desc }, limit: 1) {
          coins
        }
        inflation {
          value
        }
        average_block_time_per_day {
          average_time
        }
        average_block_time_per_hour {
          average_time
        }
        average_block_time_per_minute {
          average_time
        }
        validator {
          validatorStatuses: validator_statuses(order_by: { height: desc }, limit: 1) {
            status
            jailed
            height
          }
          validatorSigningInfos: validator_signing_infos(order_by: { height: desc }, limit: 1) {
            missedBlocksCounter: missed_blocks_counter
            tombstoned
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
          validator_descriptions {
            avatar_url
            moniker
            details
            website
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

export const useGovernmentQuery = ({ onCompleted }: IQueryParam) => {
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
    { onCompleted, pollInterval: 5000, notifyOnNetworkStatusChange: true }
  );
};

export const useProposalQuery = ({ onCompleted, proposalId }: IQueryParam) => {
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
          staking_pool_snapshot { 
            bonded_tokens 
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
    { onCompleted, pollInterval: 5000, notifyOnNetworkStatusChange: true }
  );
};

export const useHistoryByAddressQuery = ({ onCompleted, address }: IQueryParam) => {
  return useQuery(
    gql`
      query GetMessagesByAddress($address: _text, $limit: bigint = 50, $offset: bigint = 0, $types: _text = "{}") {
        messagesByAddress: messages_by_address(
          args: { addresses: $address, types: $types, limit: $limit, offset: $offset }
        ) {
          transaction {
            height
            hash
            success
            memo
            messages
            block {
              height
              timestamp
            }
          }
        }
      }
    `,
    {
      onCompleted,
      pollInterval: 5000,
      notifyOnNetworkStatusChange: true,
      variables: {
        address,
        limit: 99999,
      },
    }
  );
};

export const useTransferHistoryByAddressQuery = ({ onCompleted, address }: IQueryParam) => {
  return useQuery(
    gql`
      query GetMessagesByAddress($address: _text, $limit: bigint = 50, $offset: bigint = 0, $types: _text = "{}") {
        messagesByAddress: messages_by_address(
          args: { addresses: $address, types: $types, limit: $limit, offset: $offset }
        ) {
          transaction {
            height
            hash
            success
            messages
            memo
            block {
              height
              timestamp
            }
          }
        }
      }
    `,
    {
      onCompleted,
      pollInterval: 5000,
      notifyOnNetworkStatusChange: true,
      variables: {
        address,
        types: "{cosmos.bank.v1beta1.MsgSend}",
        limit: 99999,
      },
    }
  );
};

export const useAvataURLFromAddress = ({ onCompleted, address }: IQueryParam) => {
  return useQuery(
    gql`
      query {
        validator(
          where: { validator_info: { account: { address: { _eq: "${address}" } } } }
        ) {
          validator_descriptions {
            avatar_url,
            moniker
          }
        }
      }
    `,
    {
      onCompleted,
      pollInterval: 5000,
      notifyOnNetworkStatusChange: true,
      variables: {
        limit: 99999,
      },
    }
  );
};
