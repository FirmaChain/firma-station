import { IProposalMessageItem } from './lcd';

export interface IProposalsState {
  proposals: IProposal[];
}

export interface IProposalDetailState {
  proposalId: string;
  title: string;
  description: string;
  status: string;
  proposalTypeSummary: string[];
  submitTime: string;
  votingStartTime: string;
  votingEndTime: string;
  paramMinDepositAmount: number;
  paramQuorum: number;
  periodDeposit: number;
  extraData: any;
  messages: IProposalMessageItem[];
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
  proposalTypeSummary: string[];
  status: string;
  title: string;
  description: string;
}
