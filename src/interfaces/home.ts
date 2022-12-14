export interface IBlockState {
  height: number;
  transactions: number;
  inflation: string;
}

export interface IVotingPowerState {
  height: number;
  votingPower: number;
  totalVotingPower: number;
}

export interface ITokenomicsState {
  supply: number;
  delegated: number;
  undelegated: number;
  undelegate: number;
}
