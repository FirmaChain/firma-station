import { bindActionCreators } from "redux";

import * as modalAction from "./actions/modalAction";
import * as walletAction from "./actions/walletAction";
import * as nftAction from "./actions/nftAction";

import store from "./store";

const { dispatch } = store;

export const modalActions = bindActionCreators(modalAction, dispatch);
export const walletActions = bindActionCreators(walletAction, dispatch);
export const nftActions = bindActionCreators(nftAction, dispatch);
