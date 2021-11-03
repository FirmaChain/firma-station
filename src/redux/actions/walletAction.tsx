import { HANDLE_WALLET_ADDRESS, HANDLE_WALLET_TIMEKEY, HANDLE_WALLET_INIT } from "../types";

export const handleWalletAddress = (address: string) => ({ type: HANDLE_WALLET_ADDRESS, address });
export const handleWalletTimeKey = (timeKey: string) => ({ type: HANDLE_WALLET_TIMEKEY, timeKey });
export const handleWalletInit = (isInit: boolean) => ({ type: HANDLE_WALLET_INIT, isInit });
