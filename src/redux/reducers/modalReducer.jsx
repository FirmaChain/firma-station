import { handleActions } from "redux-actions";
import {
  HANDLE_LOGIN_MODAL,
  HANDLE_NEWWALLET_MODAL,
  HANDLE_RECOVERMNEMONIC_MODAL,
  HANDLE_IMPORTPRIVATEKEY_MODAL,
  HANDLE_CONNECTLEDGER_MODAL,
} from "../types";

const initialState = {
  loginModal: false,
  newWalletModal: false,
  recoverMnemonicModal: false,
  importPrivatekeyModal: false,
  connectLedgerModal: false,
};

export default handleActions(
  {
    [HANDLE_LOGIN_MODAL]: (state, { isVisible }) => {
      return {
        ...state,
        loginModal: isVisible,
      };
    },
    [HANDLE_NEWWALLET_MODAL]: (state, { isVisible }) => {
      return {
        ...state,
        newWalletModal: isVisible,
      };
    },
    [HANDLE_RECOVERMNEMONIC_MODAL]: (state, { isVisible }) => {
      return {
        ...state,
        recoverMnemonicModal: isVisible,
      };
    },
    [HANDLE_IMPORTPRIVATEKEY_MODAL]: (state, { isVisible }) => {
      return {
        ...state,
        importPrivatekeyModal: isVisible,
      };
    },
    [HANDLE_CONNECTLEDGER_MODAL]: (state, { isVisible }) => {
      return {
        ...state,
        connectLedgerModal: isVisible,
      };
    },
  },
  initialState
);
