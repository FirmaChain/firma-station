export interface IProposalQueryData {
  proposal: {
    proposal_deposits: {
      depositor_address: string;
      amount: { denom: string; amount: string }[];
    }[];
    proposal_votes: {
      option: string;
      voter_address: string;
    }[];
    staking_pool_snapshot: {
      bonded_tokens: number;
    };
  }[];
}

export interface IMessagesByAddress {
  messagesByAddress: {
    transaction: {
      block: { height: number; timestamp: string };
      hash: string;
      height: number;
      memo: string;
      messages: any[];
      success: boolean;
    };
  }[];
}
