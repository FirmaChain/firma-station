import { bindActionCreators } from "redux";

import * as modalAction from "./actions/modalAction";

import store from "./store";

const { dispatch } = store;

export const modalActions = bindActionCreators(modalAction, dispatch);
