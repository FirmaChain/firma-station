import { clearKeys, storeKey, getStoredWallet, invalidateWallet } from "./localStorage";

import { Wallet } from "./types";

const USER_STORE = "USER_STORE";
const FIRMA_STORE = "FIRMA_STORE";

export const getRandomKey = () => {
  return new Date().getTime().toString();
};

export const clearKey = () => {
  clearKeys();
};

export const storeWallet = (key: string, wallet: Wallet, isFirma = false) => {
  storeKey(isFirma ? FIRMA_STORE : USER_STORE, key, wallet);
};

export const isInvalidWallet = () => {
  return invalidateWallet(FIRMA_STORE);
};

export const restoreWallet = (key: string, isFirma = false) => {
  return getStoredWallet(isFirma ? FIRMA_STORE : USER_STORE, key);
};
