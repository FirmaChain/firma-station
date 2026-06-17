import { bindActionCreators } from 'redux';

import * as avatarAction from './actions/avatarAction';
import * as modalAction from './actions/modalAction';
import * as refreshAction from './actions/refreshAction';
import * as userAction from './actions/userAction';
import * as walletAction from './actions/walletAction';
import store from './store';

const { dispatch } = store;

export const modalActions = bindActionCreators(modalAction, dispatch);
export const walletActions = bindActionCreators(walletAction, dispatch);
export const userActions = bindActionCreators(userAction, dispatch);
export const avatarActions = bindActionCreators(avatarAction, dispatch);
export const refreshActions = bindActionCreators(refreshAction, dispatch);
