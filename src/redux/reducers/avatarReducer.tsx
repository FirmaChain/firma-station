import { createReducer } from '@reduxjs/toolkit';
import { HANDLE_AVATAR_LIST, HANDLE_AVATAR_LAST_UPDATED } from '../types';

export interface IAvatarState {
  avatarList: IAvatar[];
  lastUpdated: number;
}

export interface IAvatar {
  operatorAddress: string;
  moniker: string;
  url: string;
}

const initialState = {
  avatarList: [],
  lastUpdated: 0,
};

export default createReducer(initialState, {
  [HANDLE_AVATAR_LIST]: (state: IAvatarState, { avatarList }) => {
    state.avatarList = avatarList;
  },
  [HANDLE_AVATAR_LAST_UPDATED]: (state: IAvatarState, { lastUpdated }) => {
    state.lastUpdated = lastUpdated;
  },
});
