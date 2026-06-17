import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { getLegacyPersistedSlice, localStorageJsonStorage } from './persistence';

export interface IAvatarState {
	avatarList: IAvatar[];
	lastUpdated: number;
}

export interface IAvatar {
	operatorAddress: string;
	moniker: string;
	url: string;
}

interface AvatarStore extends IAvatarState {
	handleAvatarList: (avatarList: IAvatar[]) => void;
	handleAvatarLastupdated: (lastUpdated: number) => void;
}

const initialAvatarState: IAvatarState = {
	avatarList: [],
	lastUpdated: 0
};

const getInitialAvatarState = () => getLegacyPersistedSlice('avatar', initialAvatarState);

export const useAvatarStore = create<AvatarStore>()(
	persist(
		(set) => ({
			...getInitialAvatarState(),
			handleAvatarList: (avatarList: IAvatar[]) => set({ avatarList }),
			handleAvatarLastupdated: (lastUpdated: number) => set({ lastUpdated })
		}),
		{
			name: 'firma-station-avatar',
			storage: localStorageJsonStorage
		}
	)
);

export const avatarActions = {
	handleAvatarList: (avatarList: IAvatar[]) => useAvatarStore.getState().handleAvatarList(avatarList),
	handleAvatarLastupdated: (lastUpdated: number) => useAvatarStore.getState().handleAvatarLastupdated(lastUpdated)
};
