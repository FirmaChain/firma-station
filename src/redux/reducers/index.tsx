import { combineReducers } from 'redux';
import modalReducer, { IModalState } from './modalReducer';
import walletReducer, { IWalletState } from './walletReducer';
import userReducer, { IUserState } from './userReducer';
import avatarReducer, { IAvatarState } from './avatarReducer';
import refreshReducer, { IRefreshState } from './refreshReducer';

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
  refresh: refreshReducer,
});
