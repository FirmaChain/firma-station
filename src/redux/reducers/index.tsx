import { combineReducers } from 'redux';
import modalReducer, { IModalState } from './modalReducer';
import walletReducer, { IWalletState } from './walletReducer';
import userReducer, { IUserState } from './userReducer';
import avatarReducer, { IAvatarState } from './avatarReducer';

export interface rootState {
  modal: IModalState;
  wallet: IWalletState;
  user: IUserState;
  avatar: IAvatarState;
}

export default combineReducers({
  modal: modalReducer,
  wallet: walletReducer,
  user: userReducer,
  avatar: avatarReducer,
});
