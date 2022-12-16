import gql from 'graphql-tag';
import { client } from '../../apollo';
import { IProposalQueryData, IMessagesByAddress } from '../../interfaces/gql';

export const getTransactionCount = async (): Promise<number> => {
  try {
    const { data } = await client.query({
      query: gql`
        query {
          transactions: transaction_aggregate {
            aggregate {
              count
            }
          }
        }
      `,
      fetchPolicy: 'no-cache',
    });

    return data.transactions.aggregate.count;
  } catch (error) {
    return 0;
  }
};

export const getProposalQueryFromId = async (proposalId: string): Promise<IProposalQueryData | null> => {
  try {
    const { data } = await client.query({
      query: gql`
        query {
          proposal(where: { id: { _eq: ${proposalId} } }) {
            proposal_deposits {
              depositor_address
              amount
            }
            proposal_votes {
              voter_address
              option
            }
            staking_pool_snapshot {
              bonded_tokens
            }
          }
        }
      `,
      fetchPolicy: 'no-cache',
    });
    return data;
  } catch (error) {
    return null;
  }
};

export const getHistoryByAddress = async (
  address: string,
  type: string = '',
  limit: number = 50,
  offset: number = 0
): Promise<IMessagesByAddress | null> => {
  try {
    const { data } = await client.query({
      query: gql`
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
      fetchPolicy: 'no-cache',
      variables: {
        address: `{${address}}`,
        types: `{${type}}`,
        limit,
        offset,
      },
    });

    return data;
  } catch (error) {
    return null;
  }
};
