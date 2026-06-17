import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { getLegacyPersistedSlice, localStorageJsonStorage } from './persistence';

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

interface UserStore extends IUserState {
	handleUserBalance: (balance: string) => void;
	handleUserVesting: (vesting: IVesting) => void;
	handleUserTokenList: (tokenList: any[]) => void;
	handleUserNFTList: (nftList: any[]) => void;
}

const initialUserState: IUserState = {
	balance: '',
	vesting: { totalVesting: 0, expiredVesting: 0, vestingPeriod: [] },
	nftList: [],
	tokenList: []
};

const getInitialUserState = () => getLegacyPersistedSlice('user', initialUserState);

export const useUserStore = create<UserStore>()(
	persist(
		(set) => ({
			...getInitialUserState(),
			handleUserBalance: (balance: string) => set({ balance }),
			handleUserVesting: (vesting: IVesting) => set({ vesting }),
			handleUserTokenList: (tokenList: any[]) => set({ tokenList }),
			handleUserNFTList: (nftList: any[]) => set({ nftList })
		}),
		{
			name: 'firma-station-user',
			storage: localStorageJsonStorage
		}
	)
);

export const userActions = {
	handleUserBalance: (balance: string) => useUserStore.getState().handleUserBalance(balance),
	handleUserVesting: (vesting: IVesting) => useUserStore.getState().handleUserVesting(vesting),
	handleUserTokenList: (tokenList: any[]) => useUserStore.getState().handleUserTokenList(tokenList),
	handleUserNFTList: (nftList: any[]) => useUserStore.getState().handleUserNFTList(nftList)
};
