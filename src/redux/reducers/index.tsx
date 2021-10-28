import { combineReducers } from "redux";
import modalReducer, { IModalState } from "./modalReducer";
import walletReducer, { IWalletState } from "./walletReducer";
import nftReducer, { INftState } from "./nftReducer";

export interface rootState {
  modal: IModalState;
  wallet: IWalletState;
  nft: INftState;
}

export default combineReducers({
  modal: modalReducer,
  wallet: walletReducer,
  nft: nftReducer,
});
