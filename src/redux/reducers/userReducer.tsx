import { createReducer } from '@reduxjs/toolkit';

import { HANDLE_USER_BALANCE, HANDLE_USER_NFT_LIST, HANDLE_USER_TOKEN_LIST, HANDLE_USER_VESTING } from '../types';

interface IToken {
	denom: string;
	symbol: string;
	balance: number;
	decimal: number;
}

export interface IVesting {
	totalVesting: number;
	expiredVesting: number;
	vestingPeriod: IVestingPeriod[];
}

export interface IVestingPeriod {
	endTime: number;
	amount: number;
	status: number;
}

export interface IUserState {
	balance: string;
	vesting: IVesting;
	nftList: any[];
	tokenList: IToken[];
}

const initialState: IUserState = {
	balance: '',
	vesting: { totalVesting: 0, expiredVesting: 0, vestingPeriod: [] },
	nftList: [],
	tokenList: []
};

export default createReducer(initialState, (builder) => {
	builder
		.addCase(HANDLE_USER_BALANCE, (state, { balance }: any) => {
			state.balance = balance;
		})
		.addCase(HANDLE_USER_VESTING, (state, { vesting }: any) => {
			state.vesting = vesting;
		})
		.addCase(HANDLE_USER_TOKEN_LIST, (state, { tokenList }: any) => {
			state.tokenList = tokenList;
		})
		.addCase(HANDLE_USER_NFT_LIST, (state, { nftList }: any) => {
			state.nftList = nftList;
		});
});
