import { createReducer } from "@reduxjs/toolkit";
import { HANDLE_WALLET_ADDRESS, HANDLE_WALLET_TIMEKEY, HANDLE_WALLET_INIT } from "../types";

export interface IWalletState {
  address: string;
  timeKey: string;
  isInit: boolean;
}

const initialState = {
  address: "",
  timeKey: "",
  isInit: false,
};

export default createReducer(initialState, {
  [HANDLE_WALLET_ADDRESS]: (state: IWalletState, { address }) => {
    state.address = address;
  },
  [HANDLE_WALLET_TIMEKEY]: (state: IWalletState, { timeKey }) => {
    state.timeKey = timeKey;
  },
  [HANDLE_WALLET_INIT]: (state: IWalletState, { isInit }) => {
    state.isInit = isInit;
  },
});
