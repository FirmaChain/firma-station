import { useState } from "react";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { FirmaUtil } from "@firmachain/firma-js";
import axios from "axios";
import moment from "moment";

import { Wallet } from "./types";
import { LCD_REST_URI } from "../config";
import { convertNumber, convertToFctNumber, convertToTokenString, isValidString } from "./common";
import { rootState } from "../redux/reducers";
import { userActions, walletActions } from "../redux/action";
import { getRandomKey, clearKey, storeWallet, restoreWallet, isInvalidWallet } from "./keyBridge";
import { FirmaPaperWallet } from "../paperwallet";
import { FirmaSDKInternal } from "./firmaSDK";

import { ITotalStakingState, ITargetStakingState } from "../organisms/staking/hooks";

function useFirma() {
  const { enqueueSnackbar } = useSnackbar();
  const { address, timeKey, isInit, isLedger } = useSelector((state: rootState) => state.wallet);
  const [isVesting, setVesting] = useState(true);

  const restoreWalletInternal = (timeKey: string) => {
    let wallet = null;

    try {
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
    else return "";
  };

  const FirmaSDK = FirmaSDKInternal({ isLedger, getDecryptPrivateKey });

  const getNewMnemonic = async (): Promise<string> => {
    const firmaSDK = FirmaSDK.getSDK();
    const newWallet = await firmaSDK.Wallet.newWallet();

    return newWallet.getMnemonic();
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
    getVestingAccount();

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

  const isValidWallet = () => {
    if (isInvalidWallet()) return true;
    if (isLedger) return true;

    let wallet = null;
    try {
      wallet = restoreWallet(timeKey, true);
    } catch (e) {}

    return wallet !== null;
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

  const initWallet = (isInit: boolean) => {
    walletActions.handleWalletInit(isInit);
  };

  const resetWallet = () => {
    initWallet(false);

    walletActions.handleWalletAddress("");
    walletActions.handleWalletLedger(false);
    walletActions.handleWalletTimeKey(getRandomKey());

    userActions.handleUserNFTList([]);
    userActions.handleUserBalance("0");
    userActions.handleUserTokenList([]);

    clearKey();
  };

  const getAddressInternal = (): string => {
    if (!isInit) throw new Error("INVALID WALLET");
    if (!isValidString(address)) throw new Error("INVALID WALLET");

    return address;
  };

  const showAddressOnDevice = async () => {
    if (isLedger === false) return;

    await FirmaSDK.showAddressOnDevice();
  };

  const downloadPaperWallet = async () => {
    const privateKey = getDecryptPrivateKey();
    const mnemonic = getDecryptMnemonic();

    const paperWallet = new FirmaPaperWallet({
      address,
      privateKey,
      mnemonic,
    });

    let base64URI = null;
    if (mnemonic === "") {
      base64URI = await paperWallet.privatekeyToDataURI();
    } else {
      base64URI = await paperWallet.mnemonicToDataURI();
    }

    return base64URI;
  };

  const getTokenDataList = async (address: string) => {
    const firmaSDK = FirmaSDK.getSDK();
    const tokenList = await firmaSDK.Bank.getTokenBalanceList(address);

    let tokenDataList = [];

    for (let token of tokenList) {
      try {
        const tokenData = await firmaSDK.Token.getTokenData(token.denom);
        tokenDataList.push({
          denom: token.denom,
          balance: convertToTokenString(token.amount, tokenData.decimal),
          symbol: tokenData.symbol,
          decimal: tokenData.decimal,
        });
      } catch (e) {
        continue;
      }
    }

    return tokenDataList;
  };

  const getTotalDelegated = async (address: string) => {
    const firmaSDK = FirmaSDK.getSDK();
    const delegateListOrigin = await firmaSDK.Staking.getTotalDelegationInfo(address);

    let totalDelegated = 0;
    for (let i = 0; i < delegateListOrigin.length; i++) {
      totalDelegated += convertNumber(delegateListOrigin[i].balance.amount);
    }

    return totalDelegated;
  };

  const getTotalUndelegated = async (address: string) => {
    const firmaSDK = FirmaSDK.getSDK();
    const undelegateListOrigin = await firmaSDK.Staking.getTotalUndelegateInfo(address);
    const undelegationBalanceList = undelegateListOrigin.map((value) => {
      return value.entries
        .map((value) => {
          return value.balance;
        })
        .reduce((prev: string, current: string) => {
          return (convertNumber(prev) + convertNumber(current)).toString();
        });
    });

    let totalUndelegated = 0;
    for (let i = 0; i < undelegationBalanceList.length; i++) {
      totalUndelegated += convertNumber(undelegationBalanceList[i]);
    }

    return totalUndelegated;
  };

  const setUserData = async () => {
    const firmaSDK = FirmaSDK.getSDK();
    const address = getAddressInternal();

    const balance = await firmaSDK.Bank.getBalance(address);
    const tokenDataList = await getTokenDataList(address);
    const totalDelegated = await getTotalDelegated(address);
    const totalUndelegated = await getTotalUndelegated(address);

    const vestingData: any = await getVestingAccount();
    const stakingBalance = totalDelegated + totalUndelegated;
    const totalBalance = convertNumber(balance) + stakingBalance;
    const lockupVesting = vestingData.totalVesting - vestingData.expiredVesting;

    let availableBalance = 0;
    if (lockupVesting - stakingBalance > 0) {
      availableBalance = totalBalance - lockupVesting;
    } else {
      availableBalance = totalBalance - lockupVesting + (lockupVesting - stakingBalance);
    }

    const newbalance = convertToFctNumber(availableBalance);

    userActions.handleUserNFTList([]);
    userActions.handleUserBalance(newbalance > 0 ? newbalance.toString() : "0");
    userActions.handleUserTokenList(tokenDataList);
  };

  const getVestingAccount = async () => {
    if (isVesting === false || address === "") return;

    return new Promise((resolve, reject) => {
      axios
        .get(`${LCD_REST_URI}/cosmos/auth/v1beta1/accounts/${address}`, {
          validateStatus: (status) => {
            return (status >= 200 && status < 300) || status === 404;
          },
        })
        .then((res) => {
          if (
            res.status !== 404 &&
            res.data.account &&
            res.data.account["@type"] === "/cosmos.vesting.v1beta1.PeriodicVestingAccount"
          ) {
            let endTimeAcc = res.data.account.start_time * 1;
            let expiredVesting = 0;

            const vestingPeriod = res.data.account.vesting_periods.map((value: any) => {
              endTimeAcc += value.length * 1;

              let status = 0;

              if (endTimeAcc <= moment().unix()) {
                expiredVesting += value.amount[0].amount * 1;
                status = 1;
              }

              return {
                endTime: endTimeAcc,
                amount: value.amount[0].amount * 1,
                status,
              };
            });

            const totalVesting = res.data.account.base_vesting_account.original_vesting[0].amount * 1;

            resolve({ totalVesting, expiredVesting });

            userActions.handleUserVesting({
              totalVesting,
              expiredVesting,
              vestingPeriod,
            });
          } else {
            setVesting(false);
            userActions.handleUserVesting({
              totalVesting: 0,
              expiredVesting: 0,
              vestingPeriod: [],
            });

            resolve({ totalVesting: 0, expiredVesting: 0 });
          }
        })
        .catch((e) => {
          setVesting(false);
          userActions.handleUserVesting({
            totalVesting: 0,
            expiredVesting: 0,
            vestingPeriod: [],
          });

          resolve({ totalVesting: 0, expiredVesting: 0 });
        });
    });
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

  const sendFCT = async (address: string, amount: string, memo = "", estimatedGas: number) => {
    const result = await FirmaSDK.send(address, convertNumber(amount), memo, estimatedGas);

    checkVlidateResult(result);
  };

  const getGasEstimationSendFCT = async (address: string, amount: string, memo = "") => {
    return await FirmaSDK.getGasEstimationSend(address, convertNumber(amount), memo);
  };

  const sendToken = async (
    address: string,
    amount: string,
    tokenID: string,
    decimal: number,
    memo = "",
    estimatedGas: number
  ) => {
    const result = await FirmaSDK.sendToken(address, tokenID, convertNumber(amount), decimal, memo, estimatedGas);

    checkVlidateResult(result);
  };

  const getGasEstimationsendToken = async (
    address: string,
    amount: string,
    tokenID: string,
    decimal: number,
    memo = ""
  ) => {
    return await FirmaSDK.getGasEstimationSendToken(address, tokenID, convertNumber(amount), decimal, memo);
  };

  const delegate = async (validatorAddress: string, amount: number, estimatedGas: number) => {
    const result = await FirmaSDK.delegate(validatorAddress, amount, estimatedGas);

    checkVlidateResult(result);
  };

  const getGasEstimationDelegate = async (validatorAddress: string, amount: number) => {
    return await FirmaSDK.getGasEstimationDelegate(validatorAddress, amount);
  };

  const redelegate = async (
    validatorAddressSrc: string,
    validatorAddressDst: string,
    amount: number,
    estimatedGas: number
  ) => {
    const result = await FirmaSDK.redelegate(validatorAddressSrc, validatorAddressDst, amount, estimatedGas);

    checkVlidateResult(result);
  };

  const getGasEstimationRedelegate = async (
    validatorAddressSrc: string,
    validatorAddressDst: string,
    amount: number
  ) => {
    return await FirmaSDK.getGasEstimationRedelegate(validatorAddressSrc, validatorAddressDst, amount);
  };

  const undelegate = async (validatorAddress: string, amount: number, estimatedGas: number) => {
    const result = await FirmaSDK.undelegate(validatorAddress, amount, estimatedGas);

    checkVlidateResult(result);
  };

  const getGasEstimationUndelegate = async (validatorAddress: string, amount: number) => {
    return await FirmaSDK.getGasEstimationUndelegate(validatorAddress, amount);
  };

  const withdraw = async (validatorAddress: string, estimatedGas: number) => {
    const result = await FirmaSDK.withdrawAllRewards(validatorAddress, estimatedGas);

    checkVlidateResult(result);
  };

  const getGasEstimationWithdraw = async (validatorAddress: string) => {
    return await FirmaSDK.getGasEstimationWithdrawAllRewards(validatorAddress);
  };

  const withdrawAllValidator = async (estimatedGas: number) => {
    const result = await FirmaSDK.withdrawAllRewardsFromAllValidator(estimatedGas);

    checkVlidateResult(result);
  };

  const getGasEstimationWithdrawAllValidator = async () => {
    return await FirmaSDK.getGasEstimationWithdrawAllRewardsFromAllValidator();
  };

  const vote = async (proposalId: number, votingType: number, estimatedGas: number) => {
    const result = await FirmaSDK.vote(proposalId, votingType, estimatedGas);

    checkVlidateResult(result);
  };

  const getGasEstimationVote = async (proposalId: number, votingType: number) => {
    return await FirmaSDK.getGasEstimationVote(proposalId, votingType);
  };

  const deposit = async (proposalId: number, amount: number, estimatedGas: number) => {
    const result = await FirmaSDK.deposit(proposalId, amount, estimatedGas);

    checkVlidateResult(result);
  };

  const getGasEstimationDeposit = async (proposalId: number, amount: number) => {
    return await FirmaSDK.getGasEstimationDeposit(proposalId, amount);
  };

  const submitParameterChangeProposal = async (
    title: string,
    description: string,
    initialDeposit: number,
    paramList: Array<any>,
    estimatedGas: number
  ) => {
    const result = await FirmaSDK.submitParameterChangeProposal(
      title,
      description,
      initialDeposit,
      paramList,
      estimatedGas
    );

    checkVlidateResult(result);
  };

  const getGasEstimationSubmitParameterChangeProposal = async (
    title: string,
    description: string,
    initialDeposit: number,
    paramList: Array<any>
  ) => {
    return await FirmaSDK.getGasEstimationSubmitParameterChangeProposal(title, description, initialDeposit, paramList);
  };

  const submitCommunityPoolSpendProposal = async (
    title: string,
    description: string,
    initialDeposit: number,
    amount: number,
    recipient: string,
    estimatedGas: number
  ) => {
    const result = await FirmaSDK.submitCommunityPoolSpendProposal(
      title,
      description,
      initialDeposit,
      amount,
      recipient,
      estimatedGas
    );

    checkVlidateResult(result);
  };

  const getGasEstimationSubmitCommunityPoolSpendProposal = async (
    title: string,
    description: string,
    initialDeposit: number,
    amount: number,
    recipient: string
  ) => {
    return await FirmaSDK.getGasEstimationSubmitCommunityPoolSpendProposal(
      title,
      description,
      initialDeposit,
      amount,
      recipient
    );
  };

  const submitTextProposal = async (
    title: string,
    description: string,
    initialDeposit: number,
    estimatedGas: number
  ) => {
    const result = await FirmaSDK.submitTextProposal(title, description, initialDeposit, estimatedGas);

    checkVlidateResult(result);
  };

  const getGasEstimationSubmitTextProposal = async (title: string, description: string, initialDeposit: number) => {
    return await FirmaSDK.getGasEstimationSubmitTextProposal(title, description, initialDeposit);
  };

  const submitSoftwareUpgrade = async (
    title: string,
    description: string,
    initialDeposit: number,
    upgradeName: string,
    height: number,
    estimatedGas: number
  ) => {
    const result = await FirmaSDK.submitSoftwareUpgradeProposalByHeight(
      title,
      description,
      initialDeposit,
      upgradeName,
      height,
      estimatedGas
    );

    checkVlidateResult(result);
  };

  const getGasEstimationSubmitSoftwareUpgrade = async (
    title: string,
    description: string,
    initialDeposit: number,
    upgradeName: string,
    height: number
  ) => {
    return await FirmaSDK.getGasEstimationSubmitSoftwareUpgradeProposalByHeight(
      title,
      description,
      initialDeposit,
      upgradeName,
      height
    );
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
    initWallet,
    connectLedger,
    showAddressOnDevice,
    getDecryptPrivateKey,
    getDecryptMnemonic,
    isCorrectPassword,
    setUserData,
    getVestingAccount,
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
    withdrawAllValidator,
    submitParameterChangeProposal,
    submitCommunityPoolSpendProposal,
    submitTextProposal,
    submitSoftwareUpgrade,
    deposit,
    vote,
    getGasEstimationSendFCT,
    getGasEstimationsendToken,
    getGasEstimationDelegate,
    getGasEstimationRedelegate,
    getGasEstimationUndelegate,
    getGasEstimationWithdraw,
    getGasEstimationWithdrawAllValidator,
    getGasEstimationVote,
    getGasEstimationDeposit,
    getGasEstimationSubmitParameterChangeProposal,
    getGasEstimationSubmitCommunityPoolSpendProposal,
    getGasEstimationSubmitTextProposal,
    getGasEstimationSubmitSoftwareUpgrade,
    isValidWallet,
    isValidAddress,
    downloadPaperWallet,
  };
}

export default useFirma;
