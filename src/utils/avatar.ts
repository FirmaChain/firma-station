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
  if (avatar) {
    return {
      moniker: avatar.moniker,
      avatarURL: avatar.url
    };
  } else {
    return {
      moniker: operatorAddress,
      avatarURL: ''
    };
  }
};

export const getAvatarInfoFromAcc = (
  avatarList: IAvatar[],
  accAddress: string
): { moniker: string; avatarURL: string } => {
  const avatar = avatarList.find(
    (avatar) => avatar.operatorAddress === FirmaUtil.getValOperAddressFromAccAddress(accAddress)
  );
  if (avatar) {
    return {
      moniker: avatar.moniker,
      avatarURL: avatar.url
    };
  } else {
    return {
      moniker: accAddress,
      avatarURL: ''
    };
  }
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

            if (lastUpdated === lastUpdatedTime) {
              //! Fix: validator info not visible. replaced !== with ===
              for (let avatar of avatarList) {
                for (let avatarUrlRaw of avatarRaw.avatarList) {
                  if (avatar.operatorAddress === avatarUrlRaw.operatorAddress) {
                    avatar.url = avatarUrlRaw.url;
                  }
                }
              }

              avatarActions.handleAvatarList(avatarList);
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
