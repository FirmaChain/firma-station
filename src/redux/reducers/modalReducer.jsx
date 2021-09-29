import { handleActions } from "redux-actions";
import {
  HANDLE_MODAL_LOGIN,
  HANDLE_MODAL_NEWWALLET,
  HANDLE_MODAL_CONFIRMWALLET,
  HANDLE_MODAL_RECOVERMNEMONIC,
  HANDLE_MODAL_IMPORTPRIVATEKEY,
  HANDLE_MODAL_CONNECTLEDGER,
} from "../types";

const initialState = {
  login: false,
  newWallet: false,
  confirmWallet: false,
  recoverMnemonic: false,
  importPrivatekey: false,
  connectLedger: false,
};

export default handleActions(
  {
    [HANDLE_MODAL_LOGIN]: (state, { isVisible }) => {
      return {
        ...state,
        login: isVisible,
      };
    },
    [HANDLE_MODAL_NEWWALLET]: (state, { isVisible }) => {
      return {
        ...state,
        newWallet: isVisible,
      };
    },
    [HANDLE_MODAL_CONFIRMWALLET]: (state, { isVisible }) => {
      return {
        ...state,
        confirmWallet: isVisible,
      };
    },
    [HANDLE_MODAL_RECOVERMNEMONIC]: (state, { isVisible }) => {
      return {
        ...state,
        recoverMnemonic: isVisible,
      };
    },
    [HANDLE_MODAL_IMPORTPRIVATEKEY]: (state, { isVisible }) => {
      return {
        ...state,
        importPrivatekey: isVisible,
      };
    },
    [HANDLE_MODAL_CONNECTLEDGER]: (state, { isVisible }) => {
      return {
        ...state,
        connectLedger: isVisible,
      };
    },
  },
  initialState
);
