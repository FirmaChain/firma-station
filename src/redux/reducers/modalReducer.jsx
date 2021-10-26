import { handleActions } from "redux-actions";
import {
  HANDLE_MODAL_DATA,
  HANDLE_MODAL_NETWORK,
  HANDLE_MODAL_LOGIN,
  HANDLE_MODAL_NEWWALLET,
  HANDLE_MODAL_CONFIRMWALLET,
  HANDLE_MODAL_RECOVERMNEMONIC,
  HANDLE_MODAL_IMPORTPRIVATEKEY,
  HANDLE_MODAL_CONNECTLEDGER,
  HANDLE_MODAL_DELEGATE,
  HANDLE_MODAL_REDELEGATE,
  HANDLE_MODAL_UNDELEGATE,
  HANDLE_MODAL_DEPOSIT,
  HANDLE_MODAL_VOTING,
  HANDLE_MODAL_NEWPROPOSAL,
  HANDLE_MODAL_SEND,
  HANDLE_MODAL_CONFIRMTX,
  HANDLE_MODAL_QUEUETX,
  HANDLE_MODAL_RESULTTX,
} from "../types";

const initialState = {
  data: {},
  network: false,
  login: false,
  newWallet: false,
  confirmWallet: false,
  recoverMnemonic: false,
  importPrivatekey: false,
  connectLedger: false,
  delegate: false,
  redelegate: false,
  undelegate: false,
  deposit: false,
  voting: false,
  newProposal: false,
  send: false,
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
    [HANDLE_MODAL_NETWORK]: (state, { isVisible }) => {
      return {
        ...state,
        network: isVisible,
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
    [HANDLE_MODAL_DEPOSIT]: (state, { isVisible }) => {
      return {
        ...state,
        deposit: isVisible,
      };
    },
    [HANDLE_MODAL_VOTING]: (state, { isVisible }) => {
      return {
        ...state,
        voting: isVisible,
      };
    },
    [HANDLE_MODAL_NEWPROPOSAL]: (state, { isVisible }) => {
      return {
        ...state,
        newProposal: isVisible,
      };
    },
    [HANDLE_MODAL_SEND]: (state, { isVisible }) => {
      return {
        ...state,
        send: isVisible,
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
