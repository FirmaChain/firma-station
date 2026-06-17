import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { getLegacyPersistedSlice, localStorageJsonStorage } from './persistence';

export interface IRefreshState {
	// Bumped after every successful transaction so data hooks that include it in
	// their effect deps refetch on-chain data without a full page reload.
	refreshKey: number;
}

interface RefreshStore extends IRefreshState {
	handleRefresh: () => void;
}

const initialRefreshState: IRefreshState = {
	refreshKey: 0
};

const getInitialRefreshState = () => getLegacyPersistedSlice('refresh', initialRefreshState);

export const useRefreshStore = create<RefreshStore>()(
	persist(
		(set) => ({
			...getInitialRefreshState(),
			handleRefresh: () => set((state) => ({ refreshKey: state.refreshKey + 1 }))
		}),
		{
			name: 'firma-station-refresh',
			storage: localStorageJsonStorage
		}
	)
);

export const refreshActions = {
	handleRefresh: () => useRefreshStore.getState().handleRefresh()
};
