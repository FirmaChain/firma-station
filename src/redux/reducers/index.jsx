import { combineReducers } from "redux";
import modalReducer from "./modalReducer";
import walletReducer from "./walletReducer";
import nftReducer from "./nftReducer";

export default combineReducers({
  modal: modalReducer,
  wallet: walletReducer,
  nft: nftReducer,
});
