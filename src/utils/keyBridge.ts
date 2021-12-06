import { isElectron } from "./common";
import Electron from "./electron";
import { clearKeys, storeKey, storeKeyFirma, getStoredWallet, getStoredWalletFirma } from "./localStorage";

import { Wallet } from "./types";

export const getRandomKey = () => {
  return new Date().getTime().toString();
};

export const clearKey = () => {
  clearKeys();
};

export const storeWallet = (key: string, wallet: Wallet, isFirma = false) => {
  if (isFirma) storeKeyFirma(key, wallet);
  else storeKey(key, wallet);
};

export const restoreWallet = (key: string, isFirma = false) => {
  if (isFirma) return getStoredWalletFirma(key);
  else return getStoredWallet(key);
};

export const ipcTest = () => {
  if (isElectron) {
    Electron("Test", { a: 1 });
  } else {
  }
};
