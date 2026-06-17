import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { getLegacyPersistedSlice, localStorageJsonStorage } from './persistence';

export interface IWalletState {
	address: string;
	timeKey: string;
	isInit: boolean;
	isLedger: boolean;
	isMobileApp: boolean;
	walletName: string;
	balance: string;
}

interface WalletStore extends IWalletState {
	handleWalletAddress: (address: string) => void;
	handleWalletTimeKey: (timeKey: string) => void;
	handleWalletInit: (isInit: boolean) => void;
	handleWalletLedger: (isLedger: boolean) => void;
	handleWalletApp: (isMobileApp: boolean) => void;
	handleWalletName: (walletName: string) => void;
	resetWallet: () => void;
}

const initialWalletState: IWalletState = {
	address: '',
	timeKey: '',
	isInit: false,
	isLedger: false,
	isMobileApp: false,
	walletName: '',
	balance: '0'
};

const getInitialWalletState = () => getLegacyPersistedSlice('wallet', initialWalletState);

export const useWalletStore = create<WalletStore>()(
	persist(
		(set) => ({
			...getInitialWalletState(),
			handleWalletAddress: (address: string) => set({ address }),
			handleWalletTimeKey: (timeKey: string) => set({ timeKey }),
			handleWalletInit: (isInit: boolean) => set({ isInit }),
			handleWalletLedger: (isLedger: boolean) => set({ isLedger }),
			handleWalletApp: (isMobileApp: boolean) => set({ isMobileApp }),
			handleWalletName: (walletName: string) => set({ walletName }),
			resetWallet: () => set({ ...initialWalletState })
		}),
		{
			name: 'firma-station-wallet',
			storage: localStorageJsonStorage
		}
	)
);

export const walletActions = {
	handleWalletAddress: (address: string) => useWalletStore.getState().handleWalletAddress(address),
	handleWalletTimeKey: (timeKey: string) => useWalletStore.getState().handleWalletTimeKey(timeKey),
	handleWalletInit: (isInit: boolean) => useWalletStore.getState().handleWalletInit(isInit),
	handleWalletLedger: (isLedger: boolean) => useWalletStore.getState().handleWalletLedger(isLedger),
	handleWalletApp: (isMobileApp: boolean) => useWalletStore.getState().handleWalletApp(isMobileApp),
	handleWalletName: (walletName: string) => useWalletStore.getState().handleWalletName(walletName),
	resetWallet: () => useWalletStore.getState().resetWallet()
};
