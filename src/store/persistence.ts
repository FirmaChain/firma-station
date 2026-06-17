import { createJSONStorage, type StateStorage } from 'zustand/middleware';

const noopStorage: StateStorage = {
	getItem: () => null,
	setItem: () => undefined,
	removeItem: () => undefined
};

export const localStorageJsonStorage = createJSONStorage(() => (typeof window === 'undefined' ? noopStorage : window.localStorage));

export const getLegacyPersistedSlice = <T extends object>(sliceKey: string, fallback: T): T => {
	if (typeof window === 'undefined') return fallback;

	try {
		const persistedRoot = window.localStorage.getItem('persist:root');
		if (!persistedRoot) return fallback;

		const rootState = JSON.parse(persistedRoot) as Record<string, string | undefined>;
		const persistedSlice = rootState[sliceKey];
		if (!persistedSlice) return fallback;

		return {
			...fallback,
			...(JSON.parse(persistedSlice) as Partial<T>)
		};
	} catch {
		return fallback;
	}
};
