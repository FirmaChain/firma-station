import { handleActions } from "redux-actions";
import {
  HANDLE_WALLET_MNEMONIC,
  HANDLE_WALLET_PRIVATEKEY,
  HANDLE_WALLET_ADDRESS,
  HANDLE_WALLET_BALANCE,
  HANDLE_WALLET_INIT,
} from "../types";

const initialState = {
  mnemonic: "",
  privateKey: "",
  address: "",
  balance: 0,
  isInit: false,
};

export default handleActions(
  {
    [HANDLE_WALLET_MNEMONIC]: (state, { mnemonic }) => {
      return {
        ...state,
        mnemonic,
      };
    },
    [HANDLE_WALLET_PRIVATEKEY]: (state, { privateKey }) => {
      return {
        ...state,
        privateKey,
      };
    },
    [HANDLE_WALLET_ADDRESS]: (state, { address }) => {
      return {
        ...state,
        address,
      };
    },
    [HANDLE_WALLET_BALANCE]: (state, { balance }) => {
      return {
        ...state,
        balance,
      };
    },
    [HANDLE_WALLET_INIT]: (state, { isInit }) => {
      return {
        ...state,
        isInit,
      };
    },
  },
  initialState
);
