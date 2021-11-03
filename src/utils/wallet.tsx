import { useSelector } from "react-redux";
import { FirmaSDK } from "@firmachain/firma-js";

import { Wallet } from "./types";
import { FIRMACHAIN_CONFIG } from "../config";
import { convertNumber, convertToFctNumber, convertToFctString, isValid } from "./common";
import { rootState } from "../redux/reducers";
import { userActions, walletActions } from "../redux/action";
import { getRandomKey } from "./keystore";
import { storeKey, storeKeyFirma, getStoredWallet, getStoredWalletFirma, clearKeys, loadKeys } from "./localStorage";

import { ITotalStakingState, ITargetStakingState } from "../organisms/staking/hooks";

function useFirma() {
  const { isInit, timeKey } = useSelector((state: rootState) => state.wallet);

  const getFirmaSDK = () => {
    return new FirmaSDK(FIRMACHAIN_CONFIG);
  };

  const getNewMnemonic = async (): Promise<string> => {
    const newWallet = await getFirmaSDK().Wallet.newWallet();

    return newWallet.getMnemonic();
  };

  const storeWallet = (password: string, mnemonic: string, privateKey: string, address: string, timeKey: string) => {
    const wallet: Wallet = {
      mnemonic,
      privateKey,
      address,
    };

    walletActions.handleWalletAddress(address);

    storeKey(password, wallet);
    storeKeyFirma(timeKey, wallet);
    initWallet(true);
  };

  const storeWalletFromMnemonic = async (password: string, mnemonic: string, newTimeKey: string = "") => {
    const walletService = await getFirmaSDK().Wallet.fromMnemonic(mnemonic);
    const privateKey = walletService.getPrivateKey();
    const address = await walletService.getAddress();

    storeWallet(password, mnemonic, privateKey, address, newTimeKey !== "" ? newTimeKey : timeKey);
  };

  const storeWalletFromPrivateKey = async (password: string, privateKey: string, newTimeKey: string = "") => {
    const walletService = await getFirmaSDK().Wallet.fromPrivateKey(privateKey);
    const address = await walletService.getAddress();

    storeWallet(password, "", privateKey, address, newTimeKey !== "" ? newTimeKey : timeKey);
  };

  const loginWallet = async (password: string) => {
    const wallet = getStoredWallet(password);
    const timeKey = getRandomKey();

    walletActions.handleWalletTimeKey(timeKey);

    if (wallet.mnemonic !== "") {
      await storeWalletFromMnemonic(password, wallet.mnemonic, timeKey);
    } else {
      await storeWalletFromPrivateKey(password, wallet.privateKey, timeKey);
    }
  };

  const isNeedLogin = () => {
    if (isValid(loadKeys("USER_STORE"))) {
      const wallet = getStoredWalletFirma(timeKey);

      initWallet(wallet !== null);

      return wallet === null;
    } else {
      return false;
    }
  };

  const initWallet = (isInit: boolean) => {
    walletActions.handleWalletInit(isInit);
  };

  const resetWallet = () => {
    initWallet(false);

    walletActions.handleWalletAddress("");
    walletActions.handleWalletTimeKey(getRandomKey());

    clearKeys();
  };

  const setUserData = async () => {
    if (!isInit) return;

    const privateKey = getStoredWalletFirma(timeKey).privateKey;
    const wallet = await getFirmaSDK().Wallet.fromPrivateKey(privateKey);
    const address = await wallet.getAddress();
    const balance = await getFirmaSDK().Bank.getBalance(address);

    userActions.handleUserBalance(convertToFctString(balance));
  };

  const getStaking = async () => {
    if (!isInit) return;

    const privateKey = getStoredWalletFirma(timeKey).privateKey;
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
        .reduce((prev: string, current: string) => {
          return (convertNumber(prev) + convertNumber(current)).toString();
        });
    });

    const available = convertToFctNumber(convertNumber(balance));
    const delegated = convertToFctNumber(
      delegationBalanceList.length > 0
        ? delegationBalanceList.reduce((prev: string, current: string) => {
            return (convertNumber(prev) + convertNumber(current)).toString();
          })
        : 0
    );
    const undelegate = convertToFctNumber(
      undelegationBalanceList.length > 0
        ? undelegationBalanceList.reduce((prev: string, current: string) => {
            return (convertNumber(prev) + convertNumber(current)).toString();
          })
        : 0
    );
    const stakingReward = convertToFctNumber(totalReward.total);

    const result: ITotalStakingState = {
      available,
      delegated,
      undelegate,
      stakingReward,
    };

    return result;
  };

  const getStakingFromValidator = async (validatorAddress: string) => {
    if (!isInit) return;

    const privateKey = getStoredWalletFirma(timeKey).privateKey;
    const wallet = await getFirmaSDK().Wallet.fromPrivateKey(privateKey);
    const address = await wallet.getAddress();
    const balance = await getFirmaSDK().Bank.getBalance(address);
    const delegationList = await getFirmaSDK().Staking.getTotalDelegationInfo(address);
    const totalReward = await getFirmaSDK().Distribution.getTotalRewardInfo(address);

    const targetDelegation = delegationList.find((value) => value.delegation.validator_address === validatorAddress);
    const targetReward = totalReward.rewards.find((value) => value.validator_address === validatorAddress);

    const available = convertToFctNumber(balance);
    const delegated = convertToFctNumber(targetDelegation ? targetDelegation.balance.amount : 0);
    const undelegate = 0;
    const stakingReward = convertToFctNumber(targetReward ? targetReward.amount : 0);

    const result: ITargetStakingState = {
      available,
      delegated,
      undelegate,
      stakingReward,
    };

    return result;
  };

  const getDelegationList = async () => {
    if (!isInit) return;

    const privateKey = getStoredWalletFirma(timeKey).privateKey;
    const wallet = await getFirmaSDK().Wallet.fromPrivateKey(privateKey);
    const address = await wallet.getAddress();
    const delegationList = await getFirmaSDK().Staking.getTotalDelegationInfo(address);

    const parseList = delegationList.map((value) => {
      return {
        value: value.delegation.validator_address,
        label: value.delegation.validator_address,
        amount: value.delegation.shares,
      };
    });

    return parseList;
  };

  const getDelegation = async (targetValidator: string) => {
    if (!isInit) return;

    const privateKey = getStoredWalletFirma(timeKey).privateKey;
    const wallet = await getFirmaSDK().Wallet.fromPrivateKey(privateKey);
    const address = await wallet.getAddress();
    const delegationList = await getFirmaSDK().Staking.getTotalDelegationInfo(address);

    const [delegation] = delegationList
      .filter((value) => value.delegation.validator_address === targetValidator)
      .map((value) => {
        return {
          value: value.delegation.validator_address,
          amount: value.delegation.shares,
        };
      });

    return delegation;
  };

  const sendFCT = async (address: string, amount: string, memo = "") => {
    if (!isInit) return;

    const privateKey = getStoredWalletFirma(timeKey).privateKey;
    const wallet = await getFirmaSDK().Wallet.fromPrivateKey(privateKey);
    const result = await getFirmaSDK().Bank.send(wallet, address, convertNumber(amount), { memo });

    checkVlidateResult(result);
  };

  const delegate = async (validatorAddress: string, amount: number) => {
    if (!isInit) return;

    const privateKey = getStoredWalletFirma(timeKey).privateKey;
    const wallet = await getFirmaSDK().Wallet.fromPrivateKey(privateKey);
    const result = await getFirmaSDK().Staking.delegate(wallet, validatorAddress, amount);

    checkVlidateResult(result);
  };

  const redelegate = async (validatorAddressSrc: string, validatorAddressDst: string, amount: number) => {
    if (!isInit) return;

    const privateKey = getStoredWalletFirma(timeKey).privateKey;
    const wallet = await getFirmaSDK().Wallet.fromPrivateKey(privateKey);
    const result = await getFirmaSDK().Staking.redelegate(wallet, validatorAddressSrc, validatorAddressDst, amount, {
      fee: 3000,
      gas: 300000,
    });

    checkVlidateResult(result);
  };

  const undelegate = async (validatorAddress: string, amount: number) => {
    if (!isInit) return;

    const privateKey = getStoredWalletFirma(timeKey).privateKey;
    const wallet = await getFirmaSDK().Wallet.fromPrivateKey(privateKey);
    const result = await getFirmaSDK().Staking.undelegate(wallet, validatorAddress, amount);

    checkVlidateResult(result);
  };

  const withdraw = async (validatorAddress: string) => {
    if (!isInit) return;

    const privateKey = getStoredWalletFirma(timeKey).privateKey;
    const wallet = await getFirmaSDK().Wallet.fromPrivateKey(privateKey);
    const result = await getFirmaSDK().Distribution.withdrawAllRewards(wallet, validatorAddress);

    checkVlidateResult(result);
  };

  const vote = async (proposalId: number, votingType: number) => {
    if (!isInit) return;

    const privateKey = getStoredWalletFirma(timeKey).privateKey;
    const wallet = await getFirmaSDK().Wallet.fromPrivateKey(privateKey);
    const result = await getFirmaSDK().Gov.vote(wallet, proposalId, votingType);

    checkVlidateResult(result);
  };

  const deposit = async (proposalId: number, amount: number) => {
    if (!isInit) return;

    const privateKey = getStoredWalletFirma(timeKey).privateKey;
    const wallet = await getFirmaSDK().Wallet.fromPrivateKey(privateKey);
    const result = await getFirmaSDK().Gov.deposit(wallet, proposalId, amount);

    checkVlidateResult(result);
  };

  const submitParameterChangeProposal = async (
    title: string,
    description: string,
    initialDeposit: number,
    paramList: Array<any>
  ) => {
    if (!isInit) return;

    const privateKey = getStoredWalletFirma(timeKey).privateKey;
    const wallet = await getFirmaSDK().Wallet.fromPrivateKey(privateKey);
    const result = await getFirmaSDK().Gov.submitParameterChangeProposal(
      wallet,
      title,
      description,
      initialDeposit,
      paramList
    );

    checkVlidateResult(result);
  };

  const submitCommunityPoolSpendProposal = async (
    title: string,
    description: string,
    initialDeposit: number,
    amount: number,
    recipient: string
  ) => {
    if (!isInit) return;

    const privateKey = getStoredWalletFirma(timeKey).privateKey;
    const wallet = await getFirmaSDK().Wallet.fromPrivateKey(privateKey);
    const result = await getFirmaSDK().Gov.submitCommunityPoolSpendProposal(
      wallet,
      title,
      description,
      initialDeposit,
      amount,
      recipient
    );

    checkVlidateResult(result);
  };

  const submitTextProposal = async (title: string, description: string, initialDeposit: number) => {
    if (!isInit) return;

    const privateKey = getStoredWalletFirma(timeKey).privateKey;
    const wallet = await getFirmaSDK().Wallet.fromPrivateKey(privateKey);
    const result = await getFirmaSDK().Gov.submitTextProposal(wallet, title, description, initialDeposit);

    checkVlidateResult(result);
  };

  const submitSoftwareUpgrade = async (
    title: string,
    description: string,
    initialDeposit: number,
    upgradeName: string,
    height: number
  ) => {
    if (!isInit) return;

    const privateKey = getStoredWalletFirma(timeKey).privateKey;
    const wallet = await getFirmaSDK().Wallet.fromPrivateKey(privateKey);
    const result = await getFirmaSDK().Gov.submitSoftwareUpgradeProposalByHeight(
      wallet,
      title,
      description,
      initialDeposit,
      upgradeName,
      height
    );

    checkVlidateResult(result);
  };

  const checkVlidateResult = (result: any) => {
    if (result.code === undefined) throw new Error("INVALID TX");
    if (result.code !== 0) throw new Error("FAILED TX");
  };

  return {
    getNewMnemonic,
    storeWalletFromMnemonic,
    storeWalletFromPrivateKey,
    resetWallet,
    loginWallet,
    isNeedLogin,
    setUserData,
    getStaking,
    getStakingFromValidator,
    getDelegationList,
    getDelegation,
    sendFCT,
    delegate,
    redelegate,
    undelegate,
    withdraw,
    submitParameterChangeProposal,
    submitCommunityPoolSpendProposal,
    submitTextProposal,
    submitSoftwareUpgrade,
    deposit,
    vote,
  };
}

export default useFirma;
