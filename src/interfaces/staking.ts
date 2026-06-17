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
	delegationList: IDelegationList[];
	redelegationList: IRedelegationList[];
	undelegationList: IUndelegationList[];
}

export interface ITotalDelegateState {
	totalDelegated: string;
	totalRewards: string;
	delegateList: Array<IDelegationList>;
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
	delegationList: IDelegationList[];
}

export interface IDelegationList {
	validatorAddress: string;
	delegatorAddress: string;
	moniker: string;
	avatarURL: string;
	amount: number;
}

export interface IRedelegationState {
	self: number;
	selfPercent: number;
	redelegationList: IRedelegationList[];
}

export interface IRedelegationList {
	delegatorAddress: string;
	delegatorMoniker: string;
	delegatorAvatarURL: string;
	balance: string;
	completionTime: string;
	dstAddress: string;
	dstAvatarURL: string;
	dstMoniker: string;
	srcAddress: string;
	srcAvatarURL: string;
	srcMoniker: string;
}

export interface IUndelegationState {
	self: number;
	selfPercent: number;
	undelegationList: IUndelegationList[];
}

export interface IUndelegationList {
	validatorAddress: string;
	moniker: string;
	avatarURL: string;
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
