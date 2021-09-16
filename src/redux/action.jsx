import { bindActionCreators } from "redux";

import * as statusAction from "./actions/statusAction";

import store from "./store";

const { dispatch } = store;

export const StatusAction = bindActionCreators(statusAction, dispatch);
