export interface IValidatorData {
  validatorAddress: string;
  validatorMoniker: string;
  validatorAvatar: string;
  validatorDetail: string;
  validatorWebsite: string;
  selfDelegateAddress: string;
  valconsAddress: string;
  votingPower: number;
  votingPowerPercent: string;
  commission: number;
  status: string;
  jailed: boolean;
}

export interface ISigningInfo {
  address: string;
  start_height: string;
  index_offset: string;
  jailed_until: string;
  tombstoned: boolean;
  missed_blocks_counter: string;
}

export interface IProposalData {
  proposalId: string;
  status: string;
  title: string;
  description: string;
  proposalType: string;
  submitTime: string;
  votingStartTime: string;
  votingEndTime: string;
  paramQuorum: number;
  paramMinDepositAmount: number;
  periodDeposit: number;
  extraData: ISoftwareUpgrade | ICommunityPoolSpend | IParamChange | null;
  proposer: string;
  tally: {
    yes: number;
    no: number;
    noWithVeto: number;
    abstain: number;
    [key: string]: number;
  };
}

interface ISoftwareUpgrade {
  height: string;
  name: string;
  info: string;
}

interface ICommunityPoolSpend {
  recipient: string;
  amount: string;
}

interface IParamChange {
  changes: { subspace: string; key: string; value: string }[];
}
