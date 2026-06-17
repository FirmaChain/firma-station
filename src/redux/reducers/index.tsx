import { combineReducers } from 'redux';

import avatarReducer, { IAvatarState } from './avatarReducer';
import modalReducer, { IModalState } from './modalReducer';
import refreshReducer, { IRefreshState } from './refreshReducer';
import userReducer, { IUserState } from './userReducer';
import walletReducer, { IWalletState } from './walletReducer';

export interface rootState {
	modal: IModalState;
	wallet: IWalletState;
	user: IUserState;
	avatar: IAvatarState;
	refresh: IRefreshState;
}

export default combineReducers({
	modal: modalReducer,
	wallet: walletReducer,
	user: userReducer,
	avatar: avatarReducer,
	refresh: refreshReducer
});
