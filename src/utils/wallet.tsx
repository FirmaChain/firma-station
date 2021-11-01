import { useSelector } from "react-redux";
import { FirmaSDK } from "@firmachain/firma-js";

import { FIRMACHAIN_CONFIG } from "../config";
import { convertNumber, convertToFctString, convertToFctNumber } from "./common";
import { rootState } from "../redux/reducers";
import { walletActions, nftActions } from "../redux/action";

import { ITotalStakingState, ITargetStakingState } from "../organisms/staking/hooks";

function useFirma() {
  const { privateKey, isInit } = useSelector((state: rootState) => state.wallet);

  const getFirmaSDK = () => {
    return new FirmaSDK(FIRMACHAIN_CONFIG);
  };

  const generateWallet = async () => {
    const newWallet = await getFirmaSDK().Wallet.newWallet();

    walletActions.handleWalletMnemonic(newWallet.getMnemonic());

    const privateKey = await newWallet.getPrivateKey();
    const address = await newWallet.getAddress();

    setWalletState(privateKey, address);
  };

  const recoverWalletFromMnemonic = async (mnemonic: string) => {
    walletActions.handleWalletMnemonic(mnemonic);

    const wallet = await getFirmaSDK().Wallet.fromMnemonic(mnemonic, 0);
    const privateKey = await wallet.getPrivateKey();
    const address = await wallet.getAddress();

    setWalletState(privateKey, address);
  };

  const recoverWalletFromPrivateKey = async (key: string) => {
    const wallet = await getFirmaSDK().Wallet.fromPrivateKey(key);
    const privateKey = await wallet.getPrivateKey();
    const address = await wallet.getAddress();

    setWalletState(privateKey, address);
  };

  const resetWallet = async () => {
    walletActions.handleWalletMnemonic("");
    walletActions.handleWalletPrivateKey("");
    walletActions.handleWalletAddress("");
    walletActions.handleWalletBalance("0");
    walletActions.handleWalletInit(false);

    nftActions.handleNFTList([]);
  };

  const initWallet = () => {
    walletActions.handleWalletInit(true);
  };

  const setWalletState = async (privateKey: string, address: string) => {
    walletActions.handleWalletPrivateKey(privateKey);
    walletActions.handleWalletAddress(address);
    walletActions.handleWalletBalance(convertToFctString(await getFirmaSDK().Bank.getBalance(address)));

    nftActions.handleNFTList(convertNFTList(await getFirmaSDK().Nft.getNftItemAllFromAddress(address)));
  };

  const refreshWallet = async () => {
    if (!isInit) return;

    const wallet = await getFirmaSDK().Wallet.fromPrivateKey(privateKey);
    const address = await wallet.getAddress();

    setWalletState(privateKey, address);
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

    const wallet = await getFirmaSDK().Wallet.fromPrivateKey(privateKey);
    const address = await wallet.getAddress();
    const balance = await getFirmaSDK().Bank.getBalance(address);
    const delegationList = await getFirmaSDK().Staking.getTotalDelegationInfo(address);
    // const undelegationList = await getFirmaSDK().Staking.getTotalUndelegateInfo(address);
    const totalReward = await getFirmaSDK().Distribution.getTotalRewardInfo(address);

    const targetDelegation = delegationList.find((value) => value.delegation.validator_address === validatorAddress);
    // const targetUndelegate = undelegationList.find((value) => value.validator_address === validatorAddress);
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

  const checkVlidateResult = (result: any) => {
    if (result.code === undefined) throw new Error("INVALID TX");
    if (result.code !== 0) throw new Error("FAILED TX");
  };

  const sendFCT = async (address: string, amount: string, memo = "") => {
    if (!isInit) return;

    const wallet = await getFirmaSDK().Wallet.fromPrivateKey(privateKey);
    const result = await getFirmaSDK().Bank.send(wallet, address, convertNumber(amount), { memo });

    checkVlidateResult(result);
  };

  const delegate = async (validatorAddress: string, amount: number) => {
    if (!isInit) return;

    const wallet = await getFirmaSDK().Wallet.fromPrivateKey(privateKey);
    const result = await getFirmaSDK().Staking.delegate(wallet, validatorAddress, amount);
    console.log(result);

    checkVlidateResult(result);
  };

  const redelegate = async (validatorAddressSrc: string, validatorAddressDst: string, amount: number) => {
    if (!isInit) return;

    const wallet = await getFirmaSDK().Wallet.fromPrivateKey(privateKey);
    const result = await getFirmaSDK().Staking.redelegate(wallet, validatorAddressSrc, validatorAddressDst, amount, {
      fee: 3000,
      gas: 300000,
    });
    console.log(result);

    checkVlidateResult(result);
  };

  const undelegate = async (validatorAddress: string, amount: number) => {
    if (!isInit) return;

    const wallet = await getFirmaSDK().Wallet.fromPrivateKey(privateKey);
    const result = await getFirmaSDK().Staking.undelegate(wallet, validatorAddress, amount);
    console.log(result);

    checkVlidateResult(result);
  };

  const withdraw = async (validatorAddress: string) => {
    if (!isInit) return;

    const wallet = await getFirmaSDK().Wallet.fromPrivateKey(privateKey);
    const result = await getFirmaSDK().Distribution.withdrawAllRewards(wallet, validatorAddress);
    console.log(result);

    checkVlidateResult(result);
  };

  const vote = async (proposalId: number, votingType: number) => {
    if (!isInit) return;

    const wallet = await getFirmaSDK().Wallet.fromPrivateKey(privateKey);
    const result = await getFirmaSDK().Gov.vote(wallet, proposalId, votingType);

    checkVlidateResult(result);
  };

  const deposit = async (proposalId: number, amount: number) => {
    if (!isInit) return;

    const wallet = await getFirmaSDK().Wallet.fromPrivateKey(privateKey);
    const result = await getFirmaSDK().Gov.deposit(wallet, proposalId, amount);
    console.log(result);

    checkVlidateResult(result);
  };

  const submitParameterChangeProposal = async (
    title: string,
    description: string,
    initialDeposit: number,
    paramList: Array<any>
  ) => {
    if (!isInit) return;
    // paramList {
    // subspace:
    // key:
    // value:
    // }
    // proposer 지갑주소

    const wallet = await getFirmaSDK().Wallet.fromPrivateKey(privateKey);
    const result = await getFirmaSDK().Gov.submitParameterChangeProposal(
      wallet,
      title,
      description,
      initialDeposit,
      paramList
    );
    console.log(result);
  };

  const submitCommunityPoolSpendProposal = async (
    title: string,
    description: string,
    initialDeposit: number,
    amount: number,
    recipient: string
  ) => {
    if (!isInit) return;

    const wallet = await getFirmaSDK().Wallet.fromPrivateKey(privateKey);
    const result = await getFirmaSDK().Gov.submitCommunityPoolSpendProposal(
      wallet,
      title,
      description,
      initialDeposit,
      amount,
      recipient
    );
    console.log(result);
  };

  const submitTextProposal = async (title: string, description: string, initialDeposit: number) => {
    if (!isInit) return;

    const wallet = await getFirmaSDK().Wallet.fromPrivateKey(privateKey);
    const result = await getFirmaSDK().Gov.submitTextProposal(wallet, title, description, initialDeposit);
    console.log(result);
  };

  const submitSoftwareUpgrade = async (
    title: string,
    description: string,
    initialDeposit: number,
    upgradeName: string,
    height: number
  ) => {
    if (!isInit) return;

    const wallet = await getFirmaSDK().Wallet.fromPrivateKey(privateKey);
    const result = await getFirmaSDK().Gov.submitSoftwareUpgradeProposalByHeight(
      wallet,
      title,
      description,
      initialDeposit,
      upgradeName,
      height
    );
    console.log(result);
  };

  const convertNFTList = (nftResponse: any) => {
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
    refreshWallet,
  };
}

export default useFirma;
