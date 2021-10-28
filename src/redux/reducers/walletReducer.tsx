import { createReducer } from "@reduxjs/toolkit";
import {
  HANDLE_WALLET_MNEMONIC,
  HANDLE_WALLET_PRIVATEKEY,
  HANDLE_WALLET_ADDRESS,
  HANDLE_WALLET_BALANCE,
  HANDLE_WALLET_INIT,
  HANDLE_WALLET_SELECTVALIDATOR,
} from "../types";

export interface IWalletState {
  mnemonic: string;
  privateKey: string;
  address: string;
  balance: string;
  isInit: boolean;
  targetValidator: string;
}

const initialState = {
  mnemonic: "",
  privateKey: "",
  address: "",
  balance: "",
  isInit: false,
  targetValidator: "",
};

export default createReducer(initialState, {
  [HANDLE_WALLET_MNEMONIC]: (state: IWalletState, { mnemonic }) => {
    state.mnemonic = mnemonic;
  },
  [HANDLE_WALLET_PRIVATEKEY]: (state: IWalletState, { privateKey }) => {
    state.privateKey = privateKey;
  },
  [HANDLE_WALLET_ADDRESS]: (state: IWalletState, { address }) => {
    state.address = address;
  },
  [HANDLE_WALLET_BALANCE]: (state: IWalletState, { balance }) => {
    state.balance = balance;
  },
  [HANDLE_WALLET_INIT]: (state: IWalletState, { isInit }) => {
    state.isInit = isInit;
  },
  [HANDLE_WALLET_SELECTVALIDATOR]: (state: IWalletState, { validatorAddress }) => {
    state.targetValidator = validatorAddress;
  },
});
