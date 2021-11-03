import { encrypt, decrypt } from "./keystore";
import { Key, Wallet } from "./types";

const USER_STORE = "USER_STORE";
const FIRMA_STORE = "FIRMA_STORE";
const FIRMA_KEY = process.env.REACT_APP_FIRMA_KEY ?? "F";

export const loadKeys = (keyName: string): Key => {
  return JSON.parse(localStorage?.getItem(keyName) ?? "{}");
};

export const storeKeys = (keyName: string, key: Key) => {
  localStorage?.setItem(keyName, JSON.stringify(key));
};

export const clearKeys = () => {
  localStorage?.clear();
};

export const getStoredWallet = (password: string): Wallet => {
  const stored = loadKeys(USER_STORE);

  if (!stored) throw new Error("Key does not exist");

  return decryptWallet(stored.wallet, password);
};

export const storeKey = (password: string, wallet: Wallet) => {
  const key = encryptWallet(password, wallet);

  storeKeys(USER_STORE, key);
};

export const getStoredWalletFirma = (timeKey: string): Wallet => {
  const stored = loadKeys(FIRMA_STORE);

  let decrypted = null;

  try {
    if (!stored) throw new Error("Key does not exist");
    decrypted = decryptWallet(stored.wallet, timeKey + FIRMA_KEY);
  } catch (e) {}

  return decrypted;
};

export const storeKeyFirma = (timeKey: string, wallet: Wallet) => {
  const key = encryptWallet(timeKey + FIRMA_KEY, wallet);

  storeKeys(FIRMA_STORE, key);
};

const decryptWallet = (wallet: string, password: string) => {
  try {
    const decrypted = decrypt(wallet, password);
    return JSON.parse(decrypted);
  } catch (err) {
    throw new Error("Incorrect password");
  }
};

const encryptWallet = (password: string, wallet: Wallet): Key => {
  const encrypted = encrypt(JSON.stringify(wallet), password);

  if (!encrypted) throw new Error("Encryption error occurred");

  return {
    address: wallet.address,
    wallet: encrypted,
  };
};
