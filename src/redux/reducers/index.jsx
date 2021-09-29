import { combineReducers } from "redux";
import modalReducer from "./modalReducer";
import walletReducer from "./walletReducer";

export default combineReducers({
  modal: modalReducer,
  wallet: walletReducer,
});
