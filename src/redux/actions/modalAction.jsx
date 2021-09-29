import {
  HANDLE_LOGIN_MODAL,
  HANDLE_NEWWALLET_MODAL,
  HANDLE_RECOVERMNEMONIC_MODAL,
  HANDLE_IMPORTPRIVATEKEY_MODAL,
  HANDLE_CONNECTLEDGER_MODAL,
} from "../types";

export const handleLoginModal = (isVisible) => ({ type: HANDLE_LOGIN_MODAL, isVisible });
export const handleNewWalletModal = (isVisible) => ({ type: HANDLE_NEWWALLET_MODAL, isVisible });
export const handleRecoverMnemonicModal = (isVisible) => ({ type: HANDLE_RECOVERMNEMONIC_MODAL, isVisible });
export const handleImportPrivatekeyModal = (isVisible) => ({ type: HANDLE_IMPORTPRIVATEKEY_MODAL, isVisible });
export const handleConnectLedgerModal = (isVisible) => ({ type: HANDLE_CONNECTLEDGER_MODAL, isVisible });
