import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { FirmaSDK, FirmaConfig } from "@firmachain/firma-js";

import { walletActions, nftActions } from "redux/action";

function useFirma() {
  const [firmaSDK, setFirmaSDK] = useState(null);
  const { privateKey, isInit } = useSelector((state) => state.wallet);

  useEffect(() => {
    setFirmaSDK(new FirmaSDK(FirmaConfig.DevNetConfig));
  }, []);

  const generateWallet = async () => {
    setWalletState(await firmaSDK.Wallet.newWallet());
  };

  const recoverWalletFromMnemonic = async (mnemonic) => {
    setWalletState(await firmaSDK.Wallet.fromMnemonic(mnemonic, 0));
  };

  const recoverWalletFromPrivateKey = async (privateKey) => {
    setWalletState(await firmaSDK.Wallet.fromPrivateKey(privateKey));
  };

  const resetWallet = async () => {
    walletActions.handleWalletMnemonic("");
    walletActions.handleWalletPrivateKey("");
    walletActions.handleWalletAddress("");
    walletActions.handleWalletBalance(0);
    walletActions.handleWalletInit(false);

    nftActions.handleNFTList([]);
  };

  const initWallet = () => {
    walletActions.handleWalletInit(true);
  };

  const setWalletState = async (wallet) => {
    walletActions.handleWalletMnemonic(await wallet.getMnemonic());
    walletActions.handleWalletPrivateKey(await wallet.getPrivateKey());

    const address = await wallet.getAddress();
    walletActions.handleWalletAddress(address);
    walletActions.handleWalletBalance(convertToFct(await firmaSDK.Bank.getBalance(address)));
    nftActions.handleNFTList(convertNFTList(await firmaSDK.Nft.getNftItemAllFromAddress(address)));
  };

  const sendFCT = async (address, amount, memo) => {
    if (!isInit) return;

    const wallet = await firmaSDK.Wallet.fromPrivateKey(privateKey);
    const sendResult = await firmaSDK.Bank.send(wallet, address, Number(amount), { memo });
    return sendResult;
  };

  const convertToFct = (uFctAmount) => {
    return (Number(uFctAmount) / 1000000).toString();
  };

  const convertNFTList = (nftResponse) => {
    return nftResponse.dataList;
  };

  return {
    generateWallet,
    recoverWalletFromMnemonic,
    recoverWalletFromPrivateKey,
    resetWallet,
    initWallet,
    sendFCT,
    convertToFct,
  };
}

export default useFirma;
