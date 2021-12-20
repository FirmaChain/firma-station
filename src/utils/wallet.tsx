import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { FirmaUtil } from "@firmachain/firma-js";

import { Wallet } from "./types";
import { convertNumber, convertToFctNumber, convertToFctString, convertToTokenString, isValidString } from "./common";
import { rootState } from "../redux/reducers";
import { userActions, walletActions } from "../redux/action";
import { getRandomKey, clearKey, storeWallet, restoreWallet, isInvalidWallet } from "./keyBridge";
import { FirmaSDKInternal } from "./firmaSDK";

import { ITotalStakingState, ITargetStakingState } from "../organisms/staking/hooks";

function useFirma() {
  const { enqueueSnackbar } = useSnackbar();
  const { address, timeKey, isInit, isLedger } = useSelector((state: rootState) => state.wallet);

  const restoreWalletInternal = (timeKey: string) => {
    let wallet = null;

    try {
      if (isTimeout(timeKey)) {
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }

      wallet = restoreWallet(timeKey, true);
    } catch (e) {}

    return wallet;
  };

  const getDecryptPrivateKey = (): string => {
    if (!isInit) throw new Error("INVALID WALLET");

    const wallet = restoreWalletInternal(timeKey);

    if (wallet?.privateKey !== undefined) return wallet.privateKey;
    else throw new Error("INVALID WALLET");
  };

  const getDecryptMnemonic = (): string => {
    if (!isInit) throw new Error("INVALID WALLET");

    const wallet = restoreWalletInternal(timeKey);

    if (wallet?.mnemonic !== undefined) return wallet.mnemonic;
    else throw new Error("INVALID WALLET");
  };

  const FirmaSDK = FirmaSDKInternal({ isLedger, getDecryptPrivateKey });

  const getNewMnemonic = async (): Promise<string> => {
    const firmaSDK = FirmaSDK.getSDK();
    const newWallet = await firmaSDK.Wallet.newWallet();

    return newWallet.getMnemonic();
  };

  const isTimeout = (timeKey: string) => {
    if (isLedger) return false;

    if (isNaN(new Date(Number(timeKey)).getTime())) {
      return true;
    }

    return timeKey === "" || new Date().getTime() - Number(timeKey) > 600000;
  };

  const storeWalletInternal = (
    password: string,
    mnemonic: string,
    privateKey: string,
    address: string,
    timeKey: string
  ) => {
    const wallet: Wallet = {
      mnemonic,
      privateKey,
      address,
    };

    walletActions.handleWalletAddress(address);
    walletActions.handleWalletLedger(false);

    storeWallet(password, wallet);
    storeWallet(timeKey, wallet, true);
    initWallet(true);
  };

  const storeWalletFromMnemonic = async (password: string, mnemonic: string, newTimeKey: string = "") => {
    const firmaSDK = FirmaSDK.getSDK();
    const walletService = await firmaSDK.Wallet.fromMnemonic(mnemonic);
    const privateKey = walletService.getPrivateKey();
    const address = await walletService.getAddress();

    storeWalletInternal(password, mnemonic, privateKey, address, newTimeKey !== "" ? newTimeKey : timeKey);
  };

  const storeWalletFromPrivateKey = async (password: string, privateKey: string, newTimeKey: string = "") => {
    const firmaSDK = FirmaSDK.getSDK();
    const walletService = await firmaSDK.Wallet.fromPrivateKey(privateKey);
    const address = await walletService.getAddress();

    storeWalletInternal(password, "", privateKey, address, newTimeKey !== "" ? newTimeKey : timeKey);
  };

  const connectLedger = async () => {
    try {
      const address = await FirmaSDK.connectLedger();

      if (isValidString(address)) {
        walletActions.handleWalletAddress(address);
        walletActions.handleWalletLedger(true);
        initWallet(true);
      } else {
        enqueueSnackbar("Failed connect ledger", {
          variant: "error",
          autoHideDuration: 5000,
        });
      }
    } catch (e) {
      console.log("ERROR : " + e);
    }
  };

  const isCorrectPassword = (password: string) => {
    try {
      restoreWallet(password);
      return true;
    } catch (e) {
      return false;
    }
  };

  const loginWallet = async (password: string) => {
    const wallet = restoreWallet(password);
    const timeKey = getRandomKey();

    walletActions.handleWalletTimeKey(timeKey);

    if (wallet.mnemonic !== "") {
      await storeWalletFromMnemonic(password, wallet.mnemonic, timeKey);
    } else {
      await storeWalletFromPrivateKey(password, wallet.privateKey, timeKey);
    }
  };

  const isNeedLogin = () => {
    if (isInvalidWallet()) return false;

    let wallet = null;
    try {
      wallet = restoreWallet(timeKey, true);
    } catch (e) {}

    initWallet(wallet !== null);

    return wallet === null;
  };

  const initWallet = (isInit: boolean) => {
    walletActions.handleWalletInit(isInit);
  };

  const resetWallet = () => {
    initWallet(false);

    walletActions.handleWalletAddress("");
    walletActions.handleWalletLedger(false);
    walletActions.handleWalletTimeKey(getRandomKey());

    clearKey();
  };

  const getAddressInternal = (): string => {
    if (!isInit) throw new Error("INVALID WALLET");
    if (!isValidString(address)) throw new Error("INVALID WALLET");

    return address;
  };

  const setUserData = async () => {
    const firmaSDK = FirmaSDK.getSDK();
    const address = getAddressInternal();

    const balance = await firmaSDK.Bank.getBalance(address);
    // const nftList = await firmaSDK.Nft.getNftItemAllFromAddress(address);
    const tokenList = await firmaSDK.Bank.getTokenBalanceList(address);
    const tokenDataList = [];

    for (let token of tokenList) {
      const tokenData = await firmaSDK.Token.getTokenData(token.denom);
      tokenDataList.push({
        denom: token.denom,
        balance: convertToTokenString(token.amount, tokenData.decimal),
        symbol: tokenData.symbol,
        decimal: tokenData.decimal,
      });
    }

    userActions.handleUserBalance(convertToFctString(balance));
    userActions.handleUserTokenList(tokenDataList);
  };

  const getTokenData = async (denom: string) => {
    if (denom !== "ufct") {
      const firmaSDK = FirmaSDK.getSDK();
      const tokenData = await firmaSDK.Token.getTokenData(denom);

      return {
        denom: denom,
        symbol: tokenData.symbol,
        decimal: tokenData.decimal,
      };
    }

    return {
      denom: "ufct",
      symbol: "FCT",
      decimal: 6,
    };
  };

  const getStaking = async () => {
    const firmaSDK = FirmaSDK.getSDK();
    const address = getAddressInternal();

    const balance = await firmaSDK.Bank.getBalance(address);
    const delegateListOrigin = await firmaSDK.Staking.getTotalDelegationInfo(address);
    const undelegateListOrigin = await firmaSDK.Staking.getTotalUndelegateInfo(address);
    const totalReward = await firmaSDK.Distribution.getTotalRewardInfo(address);
    const delegateListSort = delegateListOrigin.sort((a: any, b: any) => b.balance.amount - a.balance.amount);

    const delegateList = delegateListSort.map((value) => {
      return {
        validatorAddress: value.delegation.validator_address,
        delegatorAddress: value.delegation.delegator_address,
        amount: convertNumber(value.balance.amount),
        moniker: value.delegation.validator_address,
        avatarURL: "",
      };
    });

    const delegationBalanceList = delegateListSort.map((value) => {
      return value.balance.amount;
    });

    const undelegationBalanceList = undelegateListOrigin.map((value) => {
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
    const stakingRewardList = totalReward.rewards;

    const result: ITotalStakingState = {
      available,
      delegated,
      undelegate,
      stakingReward,
      stakingRewardList,
      delegateList,
      undelegateList: [],
    };

    return result;
  };

  const getStakingFromValidator = async (validatorAddress: string) => {
    const firmaSDK = FirmaSDK.getSDK();
    const address = getAddressInternal();

    const balance = await firmaSDK.Bank.getBalance(address);
    const delegationList = await firmaSDK.Staking.getTotalDelegationInfo(address);
    const totalReward = await firmaSDK.Distribution.getTotalRewardInfo(address);

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
    const firmaSDK = FirmaSDK.getSDK();
    const address = getAddressInternal();

    const delegationList = await firmaSDK.Staking.getTotalDelegationInfo(address);

    const parseList = delegationList.map((value) => {
      return {
        value: value.delegation.validator_address,
        label: value.delegation.validator_address,
        amount: value.balance.amount,
      };
    });

    return parseList;
  };

  const getDelegation = async (targetValidator: string) => {
    const firmaSDK = FirmaSDK.getSDK();
    const address = getAddressInternal();

    const delegationList = await firmaSDK.Staking.getTotalDelegationInfo(address);

    const [delegation] = delegationList
      .filter((value) => value.delegation.validator_address === targetValidator)
      .map((value) => {
        return {
          value: value.delegation.validator_address,
          amount: value.balance.amount,
        };
      });

    return delegation;
  };

  const sendFCT = async (address: string, amount: string, memo = "") => {
    const result = await FirmaSDK.send(address, convertNumber(amount), memo);

    checkVlidateResult(result);
  };

  const sendToken = async (address: string, amount: string, tokenID: string, decimal: number, memo = "") => {
    const result = await FirmaSDK.sendToken(address, tokenID, convertNumber(amount), decimal, memo);

    checkVlidateResult(result);
  };

  const delegate = async (validatorAddress: string, amount: number) => {
    const result = await FirmaSDK.delegate(validatorAddress, amount);

    checkVlidateResult(result);
  };

  const redelegate = async (validatorAddressSrc: string, validatorAddressDst: string, amount: number) => {
    const result = await FirmaSDK.redelegate(validatorAddressSrc, validatorAddressDst, amount);

    checkVlidateResult(result);
  };

  const undelegate = async (validatorAddress: string, amount: number) => {
    const result = await FirmaSDK.undelegate(validatorAddress, amount);

    checkVlidateResult(result);
  };

  const withdraw = async (validatorAddress: string) => {
    const result = await FirmaSDK.withdrawAllRewards(validatorAddress);

    checkVlidateResult(result);
  };

  const vote = async (proposalId: number, votingType: number) => {
    const result = await FirmaSDK.vote(proposalId, votingType);

    checkVlidateResult(result);
  };

  const deposit = async (proposalId: number, amount: number) => {
    const result = await FirmaSDK.deposit(proposalId, amount);

    checkVlidateResult(result);
  };

  const submitParameterChangeProposal = async (
    title: string,
    description: string,
    initialDeposit: number,
    paramList: Array<any>
  ) => {
    const result = await FirmaSDK.submitParameterChangeProposal(title, description, initialDeposit, paramList);

    checkVlidateResult(result);
  };

  const submitCommunityPoolSpendProposal = async (
    title: string,
    description: string,
    initialDeposit: number,
    amount: number,
    recipient: string
  ) => {
    const result = await FirmaSDK.submitCommunityPoolSpendProposal(
      title,
      description,
      initialDeposit,
      amount,
      recipient
    );

    checkVlidateResult(result);
  };

  const submitTextProposal = async (title: string, description: string, initialDeposit: number) => {
    const result = await FirmaSDK.submitTextProposal(title, description, initialDeposit);

    checkVlidateResult(result);
  };

  const submitSoftwareUpgrade = async (
    title: string,
    description: string,
    initialDeposit: number,
    upgradeName: string,
    height: number
  ) => {
    const result = await FirmaSDK.submitSoftwareUpgradeProposalByHeight(
      title,
      description,
      initialDeposit,
      upgradeName,
      height
    );

    checkVlidateResult(result);
  };

  const checkVlidateResult = (result: any) => {
    if (result.code === undefined) {
      console.log(result);
      enqueueSnackbar(JSON.stringify(result), {
        variant: "error",
        autoHideDuration: 5000,
      });
      throw new Error("INVALID TX");
    } else if (result.code !== 0) {
      console.log(result);
      enqueueSnackbar(JSON.stringify(result), {
        variant: "error",
        autoHideDuration: 5000,
      });
      throw new Error("FAILED TX");
    }
  };

  const isValidAddress = (address: string) => {
    return FirmaUtil.isValidAddress(address);
  };

  return {
    getNewMnemonic,
    storeWalletFromMnemonic,
    storeWalletFromPrivateKey,
    resetWallet,
    loginWallet,
    connectLedger,
    getDecryptPrivateKey,
    getDecryptMnemonic,
    isNeedLogin,
    isCorrectPassword,
    setUserData,
    getTokenData,
    getStaking,
    getStakingFromValidator,
    getDelegationList,
    getDelegation,
    sendFCT,
    sendToken,
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
    isTimeout,
    isValidAddress,
  };
}

export default useFirma;
