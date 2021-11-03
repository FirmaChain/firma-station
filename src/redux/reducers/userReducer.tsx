import { createReducer } from "@reduxjs/toolkit";
import { HANDLE_USER_BALANCE, HANDLE_USER_NFT_LIST } from "../types";

export interface IUserState {
  balance: string;
  nftList: Array<any>;
}

const initialState: IUserState = {
  balance: "",
  nftList: [],
};

export default createReducer(initialState, {
  [HANDLE_USER_BALANCE]: (state: IUserState, { balance }) => {
    state.balance = balance;
  },
  [HANDLE_USER_NFT_LIST]: (state: IUserState, { nftList }) => {
    state.nftList = nftList;
  },
});
