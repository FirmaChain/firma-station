import { encrypt, decrypt } from "./keystore";
import { Key, Wallet } from "./types";

export const loadKeys = (keyName: string): Key => {
  return JSON.parse(localStorage?.getItem(keyName) ?? "{}");
};

export const storeKeys = (keyName: string, key: Key) => {
  localStorage?.setItem(keyName, JSON.stringify(key));
};

export const clearKeys = () => {
  localStorage?.clear();
};

export const invalidateWallet = (store: string) => {
  const stored = loadKeys(store);
  return Object.keys(stored).length === 0;
};

export const getStoredWallet = (store: string, password: string): Wallet => {
  const stored = loadKeys(store);

  if (!stored) throw new Error("Key does not exist");

  return decryptWallet(stored.wallet, password);
};

export const storeKey = (store: string, password: string, wallet: Wallet) => {
  const encryptData = encryptWallet(password, wallet);

  storeKeys(store, encryptData);
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
