import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FirmaSDK, FirmaConfig, TxMisc } from "@firmachain/firma-js";

import { walletActions } from "redux/action";

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
  };

  const initWallet = () => {
    walletActions.handleWalletInit(true);
  };

  const setWalletState = async (wallet) => {
    walletActions.handleWalletMnemonic(await wallet.getMnemonic());
    walletActions.handleWalletPrivateKey(await wallet.getPrivateKey());
    walletActions.handleWalletAddress(await wallet.getAddress());
    walletActions.handleWalletBalance(Number(await firmaSDK.Bank.getBalance(await wallet.getAddress())));
  };

  const sendFCT = async (address, amount, memo) => {
    if (!isInit) return;

    const wallet = await firmaSDK.Wallet.fromPrivateKey(privateKey);
    const sendResult = await firmaSDK.Wallet.send(wallet, address, Number(amount), new TxMisc(memo));
    return sendResult;
  };

  const convertToFct = (uFctAmount) => {
    return (Number(uFctAmount) / 1000000).toString();
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
