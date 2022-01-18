import { IVesting } from "../reducers/userReducer";
import { HANDLE_USER_BALANCE, HANDLE_USER_TOKEN_LIST, HANDLE_USER_VESTING, HANDLE_USER_NFT_LIST } from "../types";

export const handleUserBalance = (balance: string) => ({ type: HANDLE_USER_BALANCE, balance });
export const handleUserVesting = (vesting: IVesting) => ({ type: HANDLE_USER_VESTING, vesting });
export const handleUserTokenList = (tokenList: Array<any>) => ({ type: HANDLE_USER_TOKEN_LIST, tokenList });
export const handleUserNFTList = (nftList: Array<any>) => ({ type: HANDLE_USER_NFT_LIST, nftList });
