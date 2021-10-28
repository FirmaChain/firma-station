import { HANDLE_NFT_LIST } from "../types";

export const handleNFTList = (nftList: Array<any>) => ({ type: HANDLE_NFT_LIST, nftList });
