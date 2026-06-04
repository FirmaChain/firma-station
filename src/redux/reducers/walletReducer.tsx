import { createReducer } from '@reduxjs/toolkit';
import {
  HANDLE_WALLET_ADDRESS,
  HANDLE_WALLET_TIMEKEY,
  HANDLE_WALLET_INIT,
  HANDLE_WALLET_LEDGER,
  HANDLE_WALLET_APP,
  HANDLE_WALLET_NAME,
  RESET_WALLET,
} from '../types';

export interface IWalletState {
  address: string;
  timeKey: string;
  isInit: boolean;
  isLedger: boolean;
  isMobileApp: boolean;
  walletName: string;
  balance: string;
}

const initialState = {
  address: '',
  timeKey: '',
  isInit: false,
  isLedger: false,
  isMobileApp: false,
  walletName: '',
  balance: '0',
};

export default createReducer(initialState, (builder) => {
  builder
    .addCase(HANDLE_WALLET_ADDRESS, (state, { address }: any) => {
      state.address = address;
    })
    .addCase(HANDLE_WALLET_TIMEKEY, (state, { timeKey }: any) => {
      state.timeKey = timeKey;
    })
    .addCase(HANDLE_WALLET_INIT, (state, { isInit }: any) => {
      state.isInit = isInit;
    })
    .addCase(HANDLE_WALLET_LEDGER, (state, { isLedger }: any) => {
      state.isLedger = isLedger;
    })
    .addCase(HANDLE_WALLET_APP, (state, { isMobileApp }: any) => {
      state.isMobileApp = isMobileApp;
    })
    .addCase(HANDLE_WALLET_NAME, (state, { walletName }: any) => {
      state.walletName = walletName;
    })
    .addCase(RESET_WALLET, (state) => {
      state.address = '';
      state.timeKey = '';
      state.isInit = false;
      state.isLedger = false;
      state.isMobileApp = false;
      state.walletName = '';
      state.balance = '0';
    });
});
