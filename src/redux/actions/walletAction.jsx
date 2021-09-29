import {
  HANDLE_WALLET_MNEMONIC,
  HANDLE_WALLET_PRIVATEKEY,
  HANDLE_WALLET_ADDRESS,
  HANDLE_WALLET_BALANCE,
  HANDLE_WALLET_INIT,
} from "../types";

export const handleWalletMnemonic = (mnemonic) => ({ type: HANDLE_WALLET_MNEMONIC, mnemonic });
export const handleWalletPrivateKey = (privateKey) => ({ type: HANDLE_WALLET_PRIVATEKEY, privateKey });
export const handleWalletAddress = (address) => ({ type: HANDLE_WALLET_ADDRESS, address });
export const handleWalletBalance = (balance) => ({ type: HANDLE_WALLET_BALANCE, balance });
export const handleWalletInit = (isInit) => ({ type: HANDLE_WALLET_INIT, isInit });
