export interface IValidator {
  validatorAddress: string;
  validatorMoniker: string;
  validatorAvatar: string;
  validatorDetail: string;
  validatorWebsite: string;
  selfDelegateAddress: string;
  votingPower: number;
  votingPowerPercent: string;
  commission: number | null;
  condition: number | null;
  status: number | string;
  jailed: boolean;
  APR: number | null;
  APY: number | null;
  tombstoned: boolean;
}

export interface IValidatorsState {
  totalVotingPower: number;
  validators: IValidator[];
}

export interface ITotalStakingState {
  available: number;
  delegated: number;
  undelegate: number;
  stakingReward: number;
  stakingRewardList: any[];
  delegateList: IStakeInfo[];
  redelegationList: IRedelegationList[];
  undelegationList: IUndelegationList[];
}

export interface ITotalDelegateState {
  totalDelegated: string;
  totalRewards: string;
  delegateList: Array<IStakeInfo>;
}

export interface IRestakeState {
  validatorAddress: string;
  validatorMoniker: string;
  validatorAvatar: string;
  status: number;
  amount: number;
  reward: number;
  latestReward: number;
}

export interface ITargetStakingState {
  available: number;
  delegated: number;
  undelegate: number;
  stakingReward: number;
}

export interface IDelegationState {
  self: number;
  selfPercent: number;
  delegateList: IDelegateInfo[];
}

export interface IDelegateInfo {
  delegatorAddress: string;
  moniker: string;
  avatarURL: string;
  amount: number;
}

export interface IStakeInfo {
  validatorAddress: string;
  delegatorAddress: string;
  moniker: string;
  avatarURL: string;
  amount: number;
}

export interface IUndelegationList {
  validatorAddress: string;
  moniker: string;
  avatarURL: string;
  balance: string;
  completionTime: string;
}

export interface IRedelegationList {
  srcAddress: string;
  srcMoniker: string;
  srcAvatarURL: string;
  dstAddress: string;
  dstMoniker: string;
  dstAvatarURL: string;
  balance: string;
  completionTime: string;
}

export interface IGrantsDataState {
  maxFCT: string;
  expiration: string;
  allowValidatorList: IValidatorInfo[];
}

export interface IValidatorInfo {
  operatorAddress: string;
  moniker: string;
  avatarURL: string;
}
