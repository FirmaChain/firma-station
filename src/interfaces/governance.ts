export interface IProposalsState {
  proposals: IProposal[];
}

export interface IProposalDetailState {
  proposalId: string;
  title: string;
  description: string;
  status: string;
  proposalType: string;
  submitTime: string;
  votingStartTime: string;
  votingEndTime: string;
  paramMinDepositAmount: number;
  paramQuorum: number;
  periodDeposit: number;
  extraData: any;
  totalVotingPower: number;
  votes: any[];
  depositors: any[];
  tally: ITally;
  proposer: string;
}

export interface ITally {
  yes: number;
  no: number;
  noWithVeto: number;
  abstain: number;
  [key: string]: number;
}

interface IProposal {
  proposalId: string;
  proposalType: string;
  status: string;
  title: string;
  description: string;
}
