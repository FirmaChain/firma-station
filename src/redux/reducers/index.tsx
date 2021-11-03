import { combineReducers } from "redux";
import modalReducer, { IModalState } from "./modalReducer";
import walletReducer, { IWalletState } from "./walletReducer";
import userReducer, { IUserState } from "./userReducer";

export interface rootState {
  modal: IModalState;
  wallet: IWalletState;
  user: IUserState;
}

export default combineReducers({
  modal: modalReducer,
  wallet: walletReducer,
  user: userReducer,
});
