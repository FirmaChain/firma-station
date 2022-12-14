import axios from 'axios';

import { avatarActions } from '../redux/action';
import { VALIDATOR_IDENTITY_JSON_URI } from '../config';
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
      avatarURL: avatar.url,
    };
  } else {
    return {
      moniker: operatorAddress,
      avatarURL: '',
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
      avatarURL: avatar.url,
    };
  } else {
    return {
      moniker: accAddress,
      avatarURL: '',
    };
  }
};

export const initializeAvatar = (lastUpdated: number) => {
  getAvatarRaw()
    .then((avatarRaw) => {
      if (avatarRaw && avatarRaw.avatarList) {
        const lastUpdatedTime = avatarRaw.lastUpdatedTime;

        if (lastUpdated !== lastUpdatedTime) {
          getValidatorList().then((validatorList) => {
            let avatarList: IAvatar[] = [];
            for (let avatar of avatarRaw.avatarList) {
              for (let validator of validatorList) {
                if (validator.validatorAddress === avatar.operatorAddress) {
                  avatarList.push({
                    operatorAddress: avatar.operatorAddress,
                    moniker: validator.validatorMoniker,
                    url: avatar.url,
                  });
                  break;
                }
              }
            }
            avatarActions.handleAvatarList(avatarList);
            avatarActions.handleAvatarLastupdated(lastUpdatedTime);
          });
        }
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

const getAvatarRaw = async (): Promise<{ avatarList: IAvatar[]; lastUpdatedTime: number } | null> => {
  try {
    const response = await axios.get<{ profileInfos: IAvatar[]; lastUpdatedTime: number }>(VALIDATOR_IDENTITY_JSON_URI);

    return {
      avatarList: response.data.profileInfos,
      lastUpdatedTime: response.data.lastUpdatedTime,
    };
  } catch (error) {
    return null;
  }
};
