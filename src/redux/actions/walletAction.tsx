import {
  HANDLE_WALLET_MNEMONIC,
  HANDLE_WALLET_PRIVATEKEY,
  HANDLE_WALLET_ADDRESS,
  HANDLE_WALLET_BALANCE,
  HANDLE_WALLET_INIT,
  HANDLE_WALLET_SELECTVALIDATOR,
} from "../types";

export const handleWalletMnemonic = (mnemonic: string) => ({ type: HANDLE_WALLET_MNEMONIC, mnemonic });
export const handleWalletPrivateKey = (privateKey: string) => ({ type: HANDLE_WALLET_PRIVATEKEY, privateKey });
export const handleWalletAddress = (address: string) => ({ type: HANDLE_WALLET_ADDRESS, address });
export const handleWalletBalance = (balance: string) => ({ type: HANDLE_WALLET_BALANCE, balance });
export const handleWalletInit = (isInit: boolean) => ({ type: HANDLE_WALLET_INIT, isInit });
export const handleWalletSelectValidator = (validatorAddress: string) => ({
  type: HANDLE_WALLET_SELECTVALIDATOR,
  validatorAddress,
});
