import { IAvatar } from '../reducers/avatarReducer';
import { HANDLE_AVATAR_LIST, HANDLE_AVATAR_LAST_UPDATED } from '../types';

export const handleAvatarList = (avatarList: IAvatar[]) => ({ type: HANDLE_AVATAR_LIST, avatarList });
export const handleAvatarLastupdated = (lastupdated: number) => ({ type: HANDLE_AVATAR_LAST_UPDATED, lastupdated });
