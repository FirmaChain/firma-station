import ky from 'ky';

import { CHAIN_CONFIG } from '../config';
import { IMessagesByAddress, IProposalQueryData } from '../interfaces/gql';

interface IGraphQLResponse<T> {
	data?: T;
	errors?: { message: string }[];
}

const requestGraphQL = async <T>(query: string, variables?: Record<string, unknown>): Promise<T> => {
	const response = await ky
		.post(CHAIN_CONFIG.GRAPHQL_CONFIG.URI, {
			json: { query, variables },
			// Apollo HttpLink used the browser fetch default, which has no app-level timeout.
			// ky gets an explicit timeout so stalled GraphQL requests can fall back through existing catch handlers.
			timeout: 30_000
		})
		.json<IGraphQLResponse<T>>();

	if (response.errors?.length) {
		throw new Error(response.errors.map(({ message }) => message).join('\n'));
	}

	if (!response.data) {
		throw new Error('Empty GraphQL response');
	}

	return response.data;
};

//? Note: do not call it frequently. It is VERY heavy query.
export const getTransactionCount = async (): Promise<number> => {
	try {
		const data = await requestGraphQL<{
			block_aggregate?: { aggregate?: { sum?: { num_txs?: number | null } | null } | null } | null;
		}>(`
			query {
				block_aggregate {
					aggregate {
						sum {
							num_txs
						}
					}
				}
			}
		`);

		return data.block_aggregate?.aggregate?.sum?.num_txs ?? 0;
	} catch (error) {
		return 0;
	}
};

export const getProposalQueryFromId = async (proposalId: string): Promise<IProposalQueryData | null> => {
	try {
		const data = await requestGraphQL<IProposalQueryData>(
			`
				query GetProposalQueryFromId($proposalId: bigint!) {
					proposal(where: { id: { _eq: $proposalId } }) {
						proposal_deposits {
							amount
							depositor_address
							timestamp
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
			{ proposalId: Number(proposalId) }
		);

		return data ?? null;
	} catch (error) {
		return null;
	}
};

interface IIndexerRedelegation {
	delegator_address: string;
	validator_src_address: string;
	validator_dst_address: string;
	entries: { balance: string; completion_time: string }[];
}

// Uses the indexer's action_validator_redelegations_from helper so that
// redelegations from delegators who have no remaining stake on this validator
// (100% redelegated away) are still counted. The LCD-iteration approach in
// utils/lcdQuery missed those cases because such delegators no longer appear
// in the validator's delegation set.
export const getValidatorRedelegationsFromIndexer = async (
	valoperAddress: string
): Promise<
	{
		delegatorAddress: string;
		srcAddress: string;
		dstAddress: string;
		balance: string;
		completionTime: string;
	}[]
> => {
	try {
		const data = await requestGraphQL<{
			action_validator_redelegations_from?: {
				redelegations: IIndexerRedelegation[] | null;
			} | null;
		}>(
			`
				query Q($address: String!) {
					action_validator_redelegations_from(address: $address, limit: 1000, count_total: false) {
						redelegations
					}
				}
			`,
			{ address: valoperAddress }
		);

		const rows = data.action_validator_redelegations_from?.redelegations ?? [];
		const flat: {
			delegatorAddress: string;
			srcAddress: string;
			dstAddress: string;
			balance: string;
			completionTime: string;
		}[] = [];
		for (const r of rows) {
			for (const entry of r.entries) {
				flat.push({
					delegatorAddress: r.delegator_address,
					srcAddress: r.validator_src_address,
					dstAddress: r.validator_dst_address,
					balance: entry.balance,
					completionTime: entry.completion_time
				});
			}
		}
		return flat;
	} catch (error) {
		return [];
	}
};

export const getHistoryByAddress = async (
	address: string,
	type: string = '',
	limit: number = 50,
	offset: number = 0
): Promise<IMessagesByAddress | null> => {
	try {
		const data = await requestGraphQL<IMessagesByAddress>(
			`
				query GetMessagesByAddress($address: _text, $limit: bigint = 50, $offset: bigint = 0, $types: _text = "{}") {
					messagesByAddress: messages_by_address(args: { addresses: $address, types: $types, limit: $limit, offset: $offset }) {
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
				address: `{${address}}`,
				types: `{${type}}`,
				limit,
				offset
			}
		);

		return data ?? null;
	} catch (error) {
		return null;
	}
};
