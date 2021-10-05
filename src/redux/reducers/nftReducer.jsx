import { handleActions } from "redux-actions";
import { HANDLE_NFT_LIST } from "../types";

const initialState = {
  nftList: [],
};

export default handleActions(
  {
    [HANDLE_NFT_LIST]: (state, { nftList }) => {
      return {
        ...state,
        nftList,
      };
    },
  },
  initialState
);
