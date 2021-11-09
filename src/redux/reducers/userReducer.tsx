import { createReducer } from "@reduxjs/toolkit";
import { HANDLE_USER_BALANCE, HANDLE_USER_TOKEN_LIST, HANDLE_USER_NFT_LIST } from "../types";

interface IToken {
  denom: string;
  symbol: string;
  balance: number;
  decimal: number;
}

export interface IUserState {
  balance: string;
  nftList: Array<any>;
  tokenList: Array<IToken>;
}

const initialState: IUserState = {
  balance: "",
  nftList: [],
  tokenList: [],
};

export default createReducer(initialState, {
  [HANDLE_USER_BALANCE]: (state: IUserState, { balance }) => {
    state.balance = balance;
  },
  [HANDLE_USER_TOKEN_LIST]: (state: IUserState, { tokenList }) => {
    state.tokenList = tokenList;
  },
  [HANDLE_USER_NFT_LIST]: (state: IUserState, { nftList }) => {
    state.nftList = nftList;
  },
});
