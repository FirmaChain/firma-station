import { createReducer } from "@reduxjs/toolkit";
import { HANDLE_NFT_LIST } from "../types";

export interface INftState {
  nftList: Array<any>;
}

const initialState: INftState = {
  nftList: [],
};

export default createReducer(initialState, {
  [HANDLE_NFT_LIST]: (state: INftState, { nftList }) => {
    state.nftList = nftList;
  },
});
