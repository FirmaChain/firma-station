import {
  HANDLE_MODAL_LOGIN,
  HANDLE_MODAL_NEWWALLET,
  HANDLE_MODAL_CONFIRMWALLET,
  HANDLE_MODAL_RECOVERMNEMONIC,
  HANDLE_MODAL_IMPORTPRIVATEKEY,
  HANDLE_MODAL_CONNECTLEDGER,
  HANDLE_MODAL_DELEGATE,
} from "../types";

export const handleModalLogin = (isVisible) => ({ type: HANDLE_MODAL_LOGIN, isVisible });
export const handleModalNewWallet = (isVisible) => ({ type: HANDLE_MODAL_NEWWALLET, isVisible });
export const handleModalConfirmWallet = (isVisible) => ({ type: HANDLE_MODAL_CONFIRMWALLET, isVisible });
export const handleModalRecoverMnemonic = (isVisible) => ({ type: HANDLE_MODAL_RECOVERMNEMONIC, isVisible });
export const handleModalImportPrivatekey = (isVisible) => ({ type: HANDLE_MODAL_IMPORTPRIVATEKEY, isVisible });
export const handleModalConnectLedger = (isVisible) => ({ type: HANDLE_MODAL_CONNECTLEDGER, isVisible });
export const handleModalDelegate = (isVisible) => ({ type: HANDLE_MODAL_DELEGATE, isVisible });
