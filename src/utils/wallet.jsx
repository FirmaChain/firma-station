import { useSelector } from "react-redux";
import { walletActions, nftActions } from "redux/action";
import { FirmaSDK, FirmaUtil } from "@firmachain/firma-js";
import numeral from "numeral";

import { FIRMACHAIN_CONFIG } from "config";

function useFirma() {
  const { privateKey, isInit } = useSelector((state) => state.wallet);

  const getFirmaSDK = () => {
    return new FirmaSDK(FIRMACHAIN_CONFIG);
  };

  const generateWallet = async () => {
    setWalletState(await getFirmaSDK().Wallet.newWallet());
  };

  const recoverWalletFromMnemonic = async (mnemonic) => {
    setWalletState(await getFirmaSDK().Wallet.fromMnemonic(mnemonic, 0));
  };

  const recoverWalletFromPrivateKey = async (privateKey) => {
    setWalletState(await getFirmaSDK().Wallet.fromPrivateKey(privateKey));
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
    walletActions.handleWalletBalance(convertToFct(await getFirmaSDK().Bank.getBalance(address)));
    nftActions.handleNFTList(convertNFTList(await getFirmaSDK().Nft.getNftItemAllFromAddress(address)));
  };

  const refreshWallet = async () => {
    if (!isInit) return;

    const wallet = await getFirmaSDK().Wallet.fromPrivateKey(privateKey);
    setWalletState(wallet);
  };

  const getStaking = async () => {
    if (!isInit) return;

    const wallet = await getFirmaSDK().Wallet.fromPrivateKey(privateKey);
    const address = await wallet.getAddress();
    const balance = await getFirmaSDK().Bank.getBalance(address);
    const delegationList = await getFirmaSDK().Staking.getTotalDelegationInfo(address);
    const undelegationList = await getFirmaSDK().Staking.getTotalUndelegateInfo(address);
    const totalReward = await getFirmaSDK().Distribution.getTotalRewardInfo(address);

    const delegationBalanceList = delegationList.map((value) => {
      return value.balance.amount;
    });

    const undelegationBalanceList = undelegationList.map((value) => {
      return value.entries
        .map((value) => {
          return value.balance;
        })
        .reduce((prev, current) => {
          return numeral(prev).value() + numeral(current).value();
        });
    });

    const available = FirmaUtil.getFCTStringFromUFCTStr(balance);
    const delegated = FirmaUtil.getFCTStringFromUFCTStr(
      delegationBalanceList.reduce((acc, current) => {
        return acc + current;
      })
    );
    const undelegate = FirmaUtil.getFCTStringFromUFCTStr(
      undelegationBalanceList.reduce((acc, current) => {
        return acc + current;
      })
    );
    const stakingReward = FirmaUtil.getFCTStringFromUFCTStr(totalReward.total);

    return {
      available,
      delegated,
      undelegate,
      stakingReward,
    };
  };

  const getStakingFromValidator = async (validatorAddress) => {
    if (!isInit) return;

    const wallet = await getFirmaSDK().Wallet.fromPrivateKey(privateKey);
    const address = await wallet.getAddress();
    const balance = await getFirmaSDK().Bank.getBalance(address);
    const delegationList = await getFirmaSDK().Staking.getTotalDelegationInfo(address);
    const undelegationList = await getFirmaSDK().Staking.getTotalUndelegateInfo(address);
    const totalReward = await getFirmaSDK().Distribution.getTotalRewardInfo(address);

    const targetDelegation = delegationList.find((value) => value.delegation.validator_address === validatorAddress);
    const targetUndelegate = undelegationList.find((value) => value.validator_address === validatorAddress);
    const targetReward = totalReward.rewards.find((value) => value.validator_address === validatorAddress);

    const available = FirmaUtil.getFCTStringFromUFCTStr(balance);
    const delegated = FirmaUtil.getFCTStringFromUFCTStr(targetDelegation ? targetDelegation.balance.amount : 0);
    const undelegate = 0;
    const stakingReward = FirmaUtil.getFCTStringFromUFCTStr(targetReward ? targetReward.amount : 0);

    return {
      available,
      delegated,
      undelegate,
      stakingReward,
    };
  };

  const sendFCT = async (address, amount, memo) => {
    if (!isInit) return;

    const wallet = await getFirmaSDK().Wallet.fromPrivateKey(privateKey);
    const sendResult = await getFirmaSDK().Bank.send(wallet, address, Number(amount), { memo });
    return sendResult;
  };

  const delegate = async (validatorAddress, amount) => {
    if (!isInit) return;

    const wallet = await getFirmaSDK().Wallet.fromPrivateKey(privateKey);
    const result = await getFirmaSDK().Staking.delegate(wallet, validatorAddress, amount);
    console.log(result);
  };

  const redelegate = async (validatorAddressSrc, validatorAddressDst, amount) => {
    if (!isInit) return;

    const wallet = await getFirmaSDK().Wallet.fromPrivateKey(privateKey);
    const result = await getFirmaSDK().Staking.redelegate(wallet, validatorAddressSrc, validatorAddressDst, amount, {
      fee: 3000,
      gas: 300000,
    });
    console.log(result);
  };

  const undelegate = async (validatorAddress, amount) => {
    if (!isInit) return;

    const wallet = await getFirmaSDK().Wallet.fromPrivateKey(privateKey);
    const result = await getFirmaSDK().Staking.undelegate(wallet, validatorAddress, amount);
    console.log(result);
  };

  const withdraw = async (validatorAddress) => {
    if (!isInit) return;

    const wallet = await getFirmaSDK().Wallet.fromPrivateKey(privateKey);
    const result = await getFirmaSDK().Distribution.withdrawAllRewards(wallet, validatorAddress);
    console.log(result);
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
    getStaking,
    getStakingFromValidator,
    sendFCT,
    convertToFct,
    delegate,
    redelegate,
    undelegate,
    withdraw,
    refreshWallet,
  };
}

export default useFirma;
