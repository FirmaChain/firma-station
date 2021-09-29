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

  async function generateWallet() {
    setWalletState(await firmaSDK.Wallet.newWallet());
  }

  async function recoverWalletFromMnemonic(mnemonic) {
    setWalletState(await firmaSDK.Wallet.fromMnemonic(mnemonic, 0));
  }

  async function recoverWalletFromPrivateKey(privateKey) {
    setWalletState(await firmaSDK.Wallet.fromPrivateKey(privateKey));
  }

  async function resetWallet() {
    walletActions.handleWalletMnemonic("");
    walletActions.handleWalletPrivateKey("");
    walletActions.handleWalletAddress("");
    walletActions.handleWalletBalance(0);
    walletActions.handleWalletInit(false);
  }

  async function setWalletState(wallet) {
    walletActions.handleWalletMnemonic(await wallet.getMnemonic());
    walletActions.handleWalletPrivateKey(await wallet.getPrivateKey());
    walletActions.handleWalletAddress(await wallet.getAddress());
    walletActions.handleWalletBalance(Number(await firmaSDK.Bank.getBalance(await wallet.getAddress())));
  }

  async function sendFCT(address, amount, memo) {
    if (!isInit) return;

    const wallet = await firmaSDK.Wallet.fromPrivateKey(privateKey);
    const sendResult = await firmaSDK.Wallet.send(wallet, address, Number(amount), new TxMisc(memo));
    return sendResult;
  }

  function convertToFct(uFctAmount) {
    return (Number(uFctAmount) / 1000000).toString();
  }

  return {
    generateWallet,
    recoverWalletFromMnemonic,
    recoverWalletFromPrivateKey,
    resetWallet,
    sendFCT,
    convertToFct,
  };
}

export default useFirma;
