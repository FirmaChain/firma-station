import axios from 'axios';

import { avatarActions } from '../redux/action';
import { CHAIN_CONFIG } from '../config';
import { IAvatar } from '../redux/reducers/avatarReducer';
import { getValidatorList } from './lcdQuery';
import { FirmaUtil } from '@firmachain/firma-js';

export const getAvatarInfo = (
  avatarList: IAvatar[],
  operatorAddress: string
): { moniker: string; avatarURL: string } => {
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

export const getAvatarInfoFromAcc = (
  avatarList: IAvatar[],
  accAddress: string
): { moniker: string; avatarURL: string } => {
  const avatar = avatarList.find(
    (avatar) => avatar.operatorAddress === FirmaUtil.getValOperAddressFromAccAddress(accAddress)
  );
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
      let avatarList: IAvatar[] = [];
      for (let validator of validatorList) {
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
            // the dispatch entirely when the timestamp hadn't advanced,
            // which kept a stale avatarList (e.g. mainnet validators) in
            // persisted Redux after a network switch.
            for (let avatar of avatarList) {
              for (let avatarUrlRaw of avatarRaw.avatarList) {
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

    const response = await axios.get<{ profileInfos: IAvatar[]; lastUpdatedTime: number }>(
      `${CHAIN_CONFIG.VALIDATOR_IDENTITY_JSON_URI}?t=${new Date().getTime()}`
    );

    return {
      avatarList: response.data.profileInfos,
      lastUpdatedTime: response.data.lastUpdatedTime
    };
  } catch (error) {
    return null;
  }
};
