import { createReducer } from "@reduxjs/toolkit";
import { HANDLE_WALLET_ADDRESS, HANDLE_WALLET_TIMEKEY, HANDLE_WALLET_INIT, HANDLE_WALLET_LEDGER } from "../types";

export interface IWalletState {
  address: string;
  timeKey: string;
  isInit: boolean;
  isLedger: boolean;
}

const initialState = {
  address: "",
  timeKey: "",
  isInit: false,
  isLedger: false,
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
  [HANDLE_WALLET_LEDGER]: (state: IWalletState, { isLedger }) => {
    state.isLedger = isLedger;
  },
});
