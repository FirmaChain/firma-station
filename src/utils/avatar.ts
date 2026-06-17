import { FirmaUtil } from '@firmachain/firma-js';
import ky from 'ky';

import { CHAIN_CONFIG } from '../config';
import { avatarActions, IAvatar } from '../store';
import { getValidatorList } from './lcdQuery';

export const getAvatarInfo = (avatarList: IAvatar[], operatorAddress: string): { moniker: string; avatarURL: string } => {
	const avatar = avatarList.find((avatar) => avatar.operatorAddress === operatorAddress);
	if (avatar && avatar.moniker) {
		return {
			moniker: avatar.moniker,
			avatarURL: avatar.url
		};
	}
	return {
		moniker: operatorAddress,
		avatarURL: avatar?.url || ''
	};
};

export const getAvatarInfoFromAcc = (avatarList: IAvatar[], accAddress: string): { moniker: string; avatarURL: string } => {
	const avatar = avatarList.find((avatar) => avatar.operatorAddress === FirmaUtil.getValOperAddressFromAccAddress(accAddress));
	if (avatar && avatar.moniker) {
		return {
			moniker: avatar.moniker,
			avatarURL: avatar.url
		};
	}
	return {
		moniker: accAddress,
		avatarURL: avatar?.url || ''
	};
};

export const initializeAvatar = (lastUpdated: number) => {
	// Skip avatar initialization if in offline mode
	const isOfflineMode = window.location.pathname.includes('/offline-mode');
	if (isOfflineMode) {
		console.log('Skipping avatar initialization in offline mode');
		return;
	}

	getValidatorList()
		.then((validatorList) => {
			const avatarList: IAvatar[] = [];
			for (const validator of validatorList) {
				avatarList.push({
					operatorAddress: validator.validatorAddress,
					moniker: validator.validatorMoniker,
					url: ''
				});
			}

			getAvatarRaw()
				.then((avatarRaw) => {
					if (avatarRaw && avatarRaw.avatarList) {
						const lastUpdatedTime = avatarRaw.lastUpdatedTime;

						// Always merge URLs from the crawler into the freshly-fetched
						// chain validator list. The previous lastUpdated guard skipped
						// the update entirely when the timestamp hadn't advanced,
						// which kept a stale avatarList (e.g. mainnet validators) in
						// persisted app state after a network switch.
						for (const avatar of avatarList) {
							for (const avatarUrlRaw of avatarRaw.avatarList) {
								if (avatar.operatorAddress === avatarUrlRaw.operatorAddress) {
									avatar.url = avatarUrlRaw.url;
								}
							}
						}

						avatarActions.handleAvatarList(avatarList);
						if (lastUpdated < lastUpdatedTime) {
							avatarActions.handleAvatarLastupdated(lastUpdatedTime);
						}
					} else {
						avatarActions.handleAvatarList(avatarList);
					}
				})
				.catch((error) => {
					console.log(error);
				});
		})
		.catch((error) => {
			console.log(error);
		});
};

const getAvatarRaw = async (): Promise<{ avatarList: IAvatar[]; lastUpdatedTime: number } | null> => {
	try {
		if (CHAIN_CONFIG.VALIDATOR_IDENTITY_JSON_URI === '') throw new Error('INVALID');

		const response = await ky
			.get(`${CHAIN_CONFIG.VALIDATOR_IDENTITY_JSON_URI}?t=${new Date().getTime()}`)
			.json<{ profileInfos: IAvatar[]; lastUpdatedTime: number }>();

		return {
			avatarList: response.profileInfos,
			lastUpdatedTime: response.lastUpdatedTime
		};
	} catch (error) {
		return null;
	}
};
