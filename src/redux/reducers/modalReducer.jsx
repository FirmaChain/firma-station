import { handleActions } from "redux-actions";
import {
  HANDLE_MODAL_DATA,
  HANDLE_MODAL_LOGIN,
  HANDLE_MODAL_NEWWALLET,
  HANDLE_MODAL_CONFIRMWALLET,
  HANDLE_MODAL_RECOVERMNEMONIC,
  HANDLE_MODAL_IMPORTPRIVATEKEY,
  HANDLE_MODAL_CONNECTLEDGER,
  HANDLE_MODAL_DELEGATE,
  HANDLE_MODAL_REDELEGATE,
  HANDLE_MODAL_UNDELEGATE,
  HANDLE_MODAL_WITHDRAW,
  HANDLE_MODAL_CONFIRMTX,
  HANDLE_MODAL_QUEUETX,
  HANDLE_MODAL_RESULTTX,
} from "../types";

const initialState = {
  data: {},
  login: false,
  newWallet: false,
  confirmWallet: false,
  recoverMnemonic: false,
  importPrivatekey: false,
  connectLedger: false,
  delegate: false,
  redelegate: false,
  undelegate: false,
  withdraw: false,
  confirmTx: false,
  queueTx: false,
  resultTx: false,
};

export default handleActions(
  {
    [HANDLE_MODAL_DATA]: (state, { data }) => {
      return {
        ...state,
        data: data,
      };
    },
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
    [HANDLE_MODAL_DELEGATE]: (state, { isVisible }) => {
      return {
        ...state,
        delegate: isVisible,
      };
    },
    [HANDLE_MODAL_REDELEGATE]: (state, { isVisible }) => {
      return {
        ...state,
        redelegate: isVisible,
      };
    },
    [HANDLE_MODAL_UNDELEGATE]: (state, { isVisible }) => {
      return {
        ...state,
        undelegate: isVisible,
      };
    },
    [HANDLE_MODAL_WITHDRAW]: (state, { isVisible }) => {
      return {
        ...state,
        withdraw: isVisible,
      };
    },
    [HANDLE_MODAL_CONFIRMTX]: (state, { isVisible }) => {
      return {
        ...state,
        confirmTx: isVisible,
      };
    },
    [HANDLE_MODAL_QUEUETX]: (state, { isVisible }) => {
      return {
        ...state,
        queueTx: isVisible,
      };
    },
    [HANDLE_MODAL_RESULTTX]: (state, { isVisible }) => {
      return {
        ...state,
        resultTx: isVisible,
      };
    },
  },
  initialState
);
