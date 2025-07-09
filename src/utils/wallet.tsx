import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { FirmaUtil, AuthorizationType } from '@firmachain/firma-js';
import moment from 'moment';

import { Wallet } from './types';
import { CHAIN_CONFIG, IBC_CONFIG, SESSION_TIMOUT } from '../config';
import { convertNumber, convertToFctNumber, convertToFctString, convertToTokenString, isValidString } from './common';
import { getAvatarInfo } from './avatar';
import { rootState } from '../redux/reducers';
import { userActions, walletActions } from '../redux/action';
import { getRandomKey, clearKey, storeWallet, restoreWallet, isInvalidWallet } from './keyBridge';
import { FirmaPaperWallet } from '../paperwallet';
import { FirmaSDKInternal } from './firmaSDK';
import { ITargetStakingState, ITotalStakingState } from '../interfaces/staking';

function useFirma() {
  const { enqueueSnackbar } = useSnackbar();
  const { address, timeKey, isInit, isLedger, isMobileApp } = useSelector((state: rootState) => state.wallet);
  const { avatarList } = useSelector((state: rootState) => state.avatar);
  const [isVesting, setVesting] = useState(true);

  const initializeFirma = () => {
    if (isInit) {
      if (isTimeout(timeKey)) {
        timeout();
      } else {
        setUserData();
      }
    }
  };

  const isTimeout = (timeKey: string) => {
    if (isNaN(new Date(Number(timeKey)).getTime())) {
      return true;
    }

    return timeKey === '' || new Date().getTime() - Number(timeKey) > SESSION_TIMOUT;
  };

  const timeout = () => {
    if (isLedger || isMobileApp) {
      resetWallet();
    } else {
      walletActions.handleWalletTimeKey(getRandomKey());
      initWallet(false);
    }
  };

  const checkSession = () => {
    if (isInit === true) {
      timeout();
      window.location.reload();
    }
  };

  const restoreWalletInternal = (timeKey: string) => {
    let wallet = null;

    try {
      wallet = restoreWallet(timeKey, true);
    } catch (error) {}

    return wallet;
  };

  const getDecryptPrivateKey = (): string => {
    if (!isInit) throw new Error('INVALID WALLET');

    const wallet = restoreWalletInternal(timeKey);

    if (wallet?.privateKey !== undefined) return wallet.privateKey;
    else throw new Error('INVALID WALLET');
  };

  const getDecryptMnemonic = (): string => {
    if (!isInit) throw new Error('INVALID WALLET');

    const wallet = restoreWalletInternal(timeKey);

    if (wallet?.mnemonic !== undefined) return wallet.mnemonic;
    else return '';
  };

  const FirmaSDK = FirmaSDKInternal({ isLedger, isMobileApp, getDecryptPrivateKey });

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

  const storeWalletFromMnemonic = async (password: string, mnemonic: string) => {
    const firmaSDK = FirmaSDK.getSDK();
    const walletService = await firmaSDK.Wallet.fromMnemonic(mnemonic);
    const privateKey = walletService.getPrivateKey();
    const address = await walletService.getAddress();

    const timeKey = getRandomKey();
    walletActions.handleWalletTimeKey(timeKey);

    storeWalletInternal(password, mnemonic, privateKey, address, timeKey);
  };

  const storeWalletFromPrivateKey = async (password: string, privateKey: string) => {
    const firmaSDK = FirmaSDK.getSDK();
    const walletService = await firmaSDK.Wallet.fromPrivateKey(privateKey);
    const address = await walletService.getAddress();

    const timeKey = getRandomKey();
    walletActions.handleWalletTimeKey(timeKey);

    storeWalletInternal(password, '', privateKey, address, timeKey);
  };

  const connectLedger = async () => {
    try {
      const address = await FirmaSDK.connectLedger();

      if (isValidString(address)) {
        walletActions.handleWalletAddress(address);
        walletActions.handleWalletLedger(true);
        walletActions.handleWalletTimeKey(getRandomKey());
        initWallet(true);
      } else {
        enqueueSnackbar('Failed connect ledger', {
          variant: 'error',
          autoHideDuration: 5000,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWalletApp = async (address: string) => {
    try {
      if (isValidString(address)) {
        walletActions.handleWalletAddress(address);
        walletActions.handleWalletApp(true);
        walletActions.handleWalletTimeKey(getRandomKey());
        initWallet(true);
      } else {
        enqueueSnackbar('Failed connect wallet app', {
          variant: 'error',
          autoHideDuration: 5000,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const isValidWallet = () => {
    if (isInvalidWallet()) return true;
    if (isLedger) return true;

    let wallet = null;
    try {
      wallet = restoreWallet(timeKey, true);
    } catch (error) {}

    return wallet !== null;
  };

  const isCorrectPassword = (password: string) => {
    try {
      restoreWallet(password);
      return true;
    } catch (error) {
      return false;
    }
  };

  const loginWallet = async (password: string) => {
    const wallet = restoreWallet(password);

    if (wallet.mnemonic !== '') {
      await storeWalletFromMnemonic(password, wallet.mnemonic);
    } else {
      await storeWalletFromPrivateKey(password, wallet.privateKey);
    }
  };

  const initWallet = (isInit: boolean) => {
    walletActions.handleWalletInit(isInit);
  };

  const resetWallet = () => {
    initWallet(false);

    walletActions.handleWalletAddress('');
    walletActions.handleWalletLedger(false);
    walletActions.handleWalletApp(false);
    walletActions.handleWalletTimeKey(getRandomKey());

    userActions.handleUserNFTList([]);
    userActions.handleUserBalance('0');
    userActions.handleUserTokenList([]);

    clearKey();
  };

  const getAddressInternal = (): string => {
    if (!isInit) throw new Error('INVALID WALLET');
    if (!isValidString(address)) throw new Error('INVALID WALLET');

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
    if (mnemonic === '') {
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
        if (token.denom === CHAIN_CONFIG.PARAMS.DENOM) continue;

        let tokenData = {
          decimal: 0,
          symbol: token.denom,
        };

        try {
          if (token.denom.includes('ibc') === true) {
            const targetIBCCoin = IBC_CONFIG[tokenData.symbol];

            if (targetIBCCoin) {
              tokenData.symbol = targetIBCCoin.symbol;
              tokenData.decimal = targetIBCCoin.decimal;
            }
          } else {
            tokenData = await firmaSDK.Token.getTokenData(token.denom);
            tokenData.symbol = tokenData.symbol.toUpperCase();
          }

          tokenDataList.push({
            denom: token.denom,
            balance: convertToTokenString(token.amount, tokenData.decimal),
            symbol: tokenData.symbol,
            decimal: tokenData.decimal,
          });
        } catch (e) {
          console.error(e);
        }
      } catch (error) {
        continue;
      }
    }

    return tokenDataList;
  };

  const getTotalDelegated = async (address: string) => {
    const firmaSDK = FirmaSDK.getSDK();
    const delegateListOrigin = (await firmaSDK.Staking.getTotalDelegationInfo(address)).dataList;

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
    try {
      const firmaSDK = FirmaSDK.getSDK();
      const userAddress = getAddressInternal();

      const balance = await firmaSDK.Bank.getBalance(userAddress);
      const tokenDataList = await getTokenDataList(userAddress);
      const totalDelegated = await getTotalDelegated(userAddress);
      const totalUndelegated = await getTotalUndelegated(userAddress);

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
      userActions.handleUserBalance(newbalance > 0 ? newbalance.toString() : '0');
      userActions.handleUserTokenList(tokenDataList);
    } catch (error) {}
  };

  const getVestingAccount = async () => {
    return new Promise((resolve, reject) => {
      if (isVesting === false || address === '') {
        resolve({ totalVesting: 0, expiredVesting: 0 });
        return;
      }

      let isChecked = false;

      if (CHAIN_CONFIG.VESTING_ACCOUNTS.length > 0) {
        for (let account of CHAIN_CONFIG.VESTING_ACCOUNTS) {
          if (account['@type'] === '/cosmos.vesting.v1beta1.PeriodicVestingAccount') {
            if (account['base_vesting_account']['base_account']['address'] === address) {
              let endTimeAcc = convertNumber(account['start_time']) * 1;
              let expiredVesting = 0;

              const periods: any[] = account['vesting_periods'];

              if (periods !== undefined) {
                const vestingPeriod = periods.map((value: any) => {
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

                const totalVesting = convertNumber(account['base_vesting_account']['original_vesting'][0]['amount']);

                resolve({ totalVesting, expiredVesting });

                userActions.handleUserVesting({
                  totalVesting,
                  expiredVesting,
                  vestingPeriod,
                });

                isChecked = true;
                break;
              }
            }
          }
        }
      }

      if (isChecked === false) {
        userActions.handleUserVesting({
          totalVesting: 0,
          expiredVesting: 0,
          vestingPeriod: [],
        });

        setVesting(false);

        resolve({ totalVesting: 0, expiredVesting: 0 });
      }
    });
  };

  const getStaking = async () => {
    const firmaSDK = FirmaSDK.getSDK();
    const address = getAddressInternal();

    const balance = await firmaSDK.Bank.getBalance(address);
    const delegateListOrigin = (await firmaSDK.Staking.getTotalDelegationInfo(address)).dataList;
    const undelegateListOrigin = await firmaSDK.Staking.getTotalUndelegateInfo(address);
    const totalReward = await firmaSDK.Distribution.getTotalRewardInfo(address);
    const delegateListSort = delegateListOrigin.sort((a: any, b: any) => b.balance.amount - a.balance.amount);

    const delegateList = delegateListSort.map((value) => {
      const { moniker, avatarURL } = getAvatarInfo(avatarList, value.delegation.validator_address);
      return {
        validatorAddress: value.delegation.validator_address,
        delegatorAddress: value.delegation.delegator_address,
        amount: convertNumber(value.balance.amount),
        moniker,
        avatarURL,
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

    const redelegationList = await getRedelegationList();
    const undelegationList = await getUndelegationList();

    const result: ITotalStakingState = {
      available,
      delegated,
      undelegate,
      stakingReward,
      stakingRewardList,
      delegateList,
      redelegationList,
      undelegationList,
    };

    return result;
  };

  const getStakingFromValidator = async (validatorAddress: string) => {
    const firmaSDK = FirmaSDK.getSDK();
    const address = getAddressInternal();

    const balance = await firmaSDK.Bank.getBalance(address);
    const delegationList = (await firmaSDK.Staking.getTotalDelegationInfo(address)).dataList;
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

    const delegationList = (await firmaSDK.Staking.getTotalDelegationInfo(address)).dataList;

    const parseList = delegationList.map((value) => {
      return {
        value: value.delegation.validator_address,
        label: value.delegation.validator_address,
        amount: value.balance.amount,
      };
    });

    return parseList;
  };

  const getDelegationListWithReward = async () => {
    const firmaSDK = FirmaSDK.getSDK();
    const address = getAddressInternal();

    const delegationList = (await firmaSDK.Staking.getTotalDelegationInfo(address)).dataList;

    const totalReward = await firmaSDK.Distribution.getTotalRewardInfo(address);

    let parseList = [];
    for (let i = 0; i < delegationList.length; i++) {
      let value = delegationList[i].delegation.validator_address;
      let amount = delegationList[i].balance.amount;
      let rewards = '0';

      if (Math.ceil(convertNumber(amount.split('.')[0])) === 0) {
        continue;
      }

      for (let j = 0; j < totalReward.rewards.length; j++) {
        if (totalReward.rewards[j].validator_address === value) {
          rewards = totalReward.rewards[j].amount;
        }
      }

      amount = Math.ceil(convertNumber(amount.split('.')[0])).toString();
      rewards = Math.ceil(convertNumber(rewards.split('.')[0])).toString();

      parseList.push({
        value,
        amount,
        rewards,
      });
    }

    return parseList;
  };

  const getRedelegationList = async () => {
    const firmaSDK = FirmaSDK.getSDK();
    const address = getAddressInternal();

    const redelegationList = await firmaSDK.Staking.getTotalRedelegationInfo(address);

    let parseList = [];
    for (let redelegation of redelegationList) {
      const srcAddress = redelegation.redelegation.validator_src_address;
      const dstAddress = redelegation.redelegation.validator_dst_address;
      const srcAvatar = getAvatarInfo(avatarList, srcAddress);
      const dstAvatar = getAvatarInfo(avatarList, dstAddress);

      for (let entry of redelegation.entries) {
        const completionTime = entry.redelegation_entry.completion_time;
        const balance = convertToFctString(entry.redelegation_entry.shares_dst);

        parseList.push({
          srcAddress,
          srcMoniker: srcAvatar.moniker,
          srcAvatarURL: srcAvatar.avatarURL,
          dstAddress,
          dstMoniker: dstAvatar.moniker,
          dstAvatarURL: dstAvatar.avatarURL,
          balance,
          completionTime,
        });
      }
    }

    parseList.sort((a: any, b: any) => {
      return new Date(a.completionTime).getTime() - new Date(b.completionTime).getTime();
    });

    return parseList;
  };

  const getUndelegationList = async () => {
    const firmaSDK = FirmaSDK.getSDK();
    const address = getAddressInternal();

    const undelegationList = await firmaSDK.Staking.getTotalUndelegateInfo(address);

    let parseList = [];
    for (let undelegation of undelegationList) {
      const validatorAddress = undelegation.validator_address;
      const avatar = getAvatarInfo(avatarList, validatorAddress);

      for (let entry of undelegation.entries) {
        const completionTime = entry.completion_time;
        const balance = convertToFctString(entry.balance);

        parseList.push({
          validatorAddress,
          moniker: avatar.moniker,
          avatarURL: avatar.avatarURL,
          balance,
          completionTime,
        });
      }
    }

    parseList.sort((a: any, b: any) => {
      return new Date(a.completionTime).getTime() - new Date(b.completionTime).getTime();
    });

    return parseList;
  };

  const getDelegation = async (targetValidator: string) => {
    const firmaSDK = FirmaSDK.getSDK();
    const address = getAddressInternal();

    const delegationList = (await firmaSDK.Staking.getTotalDelegationInfo(address)).dataList;

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

  const sendFCT = async (address: string, amount: string, memo = '', estimatedGas: number) => {
    const result = await FirmaSDK.send(address, convertNumber(amount), memo, estimatedGas);

    checkValidateResult(result);
  };

  const getGasEstimationSendFCT = async (address: string, amount: string, memo = '') => {
    return await FirmaSDK.getGasEstimationSend(address, convertNumber(amount), memo);
  };

  const sendToken = async (
    address: string,
    amount: string,
    tokenID: string,
    decimal: number,
    memo = '',
    estimatedGas: number
  ) => {
    const result = await FirmaSDK.sendToken(address, tokenID, convertNumber(amount), decimal, memo, estimatedGas);

    checkValidateResult(result);
  };

  const getGasEstimationSendToken = async (
    address: string,
    amount: string,
    tokenID: string,
    decimal: number,
    memo = ''
  ) => {
    return await FirmaSDK.getGasEstimationSendToken(address, tokenID, convertNumber(amount), decimal, memo);
  };

  const sendIBC = async (
    address: string,
    amount: string,
    denom: string,
    decimal: number,
    memo = '',
    estimatedGas: number
  ) => {
    const result = await FirmaSDK.sendIBC(address, convertNumber(amount), denom, decimal, memo, estimatedGas);

    checkValidateResult(result);
  };

  const getGasEstimationsendIBC = async (
    address: string,
    amount: string,
    denom: string,
    decimal: number,
    memo = ''
  ) => {
    return await FirmaSDK.getGasEstimationSendIBC(address, convertNumber(amount), denom, decimal, memo);
  };

  const delegate = async (validatorAddress: string, amount: number, estimatedGas: number) => {
    const result = await FirmaSDK.delegate(validatorAddress, amount, estimatedGas);

    checkValidateResult(result);
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

    checkValidateResult(result);
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

    checkValidateResult(result);
  };

  const getGasEstimationUndelegate = async (validatorAddress: string, amount: number) => {
    return await FirmaSDK.getGasEstimationUndelegate(validatorAddress, amount);
  };

  const withdraw = async (validatorAddress: string, estimatedGas: number) => {
    const result = await FirmaSDK.withdrawAllRewards(validatorAddress, estimatedGas);

    checkValidateResult(result);
  };

  const getGasEstimationWithdraw = async (validatorAddress: string) => {
    return await FirmaSDK.getGasEstimationWithdrawAllRewards(validatorAddress);
  };

  const withdrawAllValidator = async (estimatedGas: number) => {
    const result = await FirmaSDK.withdrawAllRewardsFromAllValidator(estimatedGas);

    checkValidateResult(result);
  };

  const getGasEstimationWithdrawAllValidator = async () => {
    return await FirmaSDK.getGasEstimationWithdrawAllRewardsFromAllValidator();
  };

  const vote = async (proposalId: number, votingType: number, estimatedGas: number) => {
    const result = await FirmaSDK.vote(proposalId, votingType, estimatedGas);

    checkValidateResult(result);
  };

  const getGasEstimationVote = async (proposalId: number, votingType: number) => {
    return await FirmaSDK.getGasEstimationVote(proposalId, votingType);
  };

  const deposit = async (proposalId: number, amount: number, estimatedGas: number) => {
    const result = await FirmaSDK.deposit(proposalId, amount, estimatedGas);

    checkValidateResult(result);
  };

  const getGasEstimationDeposit = async (proposalId: number, amount: number) => {
    return await FirmaSDK.getGasEstimationDeposit(proposalId, amount);
  };

  const submitParameterChangeProposal = async (
    title: string,
    description: string,
    initialDeposit: number,
    paramList: any[],
    estimatedGas: number
  ) => {
    const result = await FirmaSDK.submitParameterChangeProposal(
      title,
      description,
      initialDeposit,
      paramList,
      estimatedGas
    );

    checkValidateResult(result);
  };

  const getGasEstimationSubmitParameterChangeProposal = async (
    title: string,
    description: string,
    initialDeposit: number,
    paramList: any[]
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

    checkValidateResult(result);
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

    checkValidateResult(result);
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
   
    checkValidateResult(result);
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

  const submitCancelSoftwareUpgrade = async (
    title: string,
    description: string,
    initialDeposit: number,
    estimatedGas: number
  ) => {
    const result = await FirmaSDK.submitCancelSoftwareUpgradeProposal(title, description, initialDeposit, estimatedGas);

    checkValidateResult(result);
  };

  const getGasEstimationSubmitCancelSoftwareUpgrade = async (
    title: string,
    description: string,
    initialDeposit: number
  ) => {
    return await FirmaSDK.getGasEstimationSubmitCancelSoftwareUpgradeProposal(title, description, initialDeposit);
  };

  const submitStakingParamsUpdateProposal = async (
    title: string,
    summary: string,
    initialDeposit: number,
    params: any,
    metadata: string = '',
    estimatedGas: number
  ) => {
    const result = await FirmaSDK.submitStakingParamsUpdateProposal(
      title,
      summary,
      initialDeposit,
      params,
      metadata,
      estimatedGas
    );

    checkValidateResult(result);
  };

  const getGasEstimationSubmitStakingParamsUpdateProposal = async (
    title: string,
    summary: string,
    initialDeposit: number,
    params: any,
    metadata: string = ''
  ) => {
    return await FirmaSDK.getGasEstimationSubmitStakingParamsUpdateProposal(
      title,
      summary,
      initialDeposit,
      params,
      metadata
    );
  };

  const submitGovParamsUpdateProposal = async (
    title: string,
    summary: string,
    initialDeposit: number,
    params: any,
    metadata: string = '',
    estimatedGas: number
  ) => {
    const result = await FirmaSDK.submitGovParamsUpdateProposal(
      title,
      summary,
      initialDeposit,
      params,
      metadata,
      estimatedGas
    );

    checkValidateResult(result);
  };

  const getGasEstimationSubmitGovParamsUpdateProposal = async (
    title: string,
    summary: string,
    initialDeposit: number,
    params: any,
    metadata: string = ''
  ) => {
    return await FirmaSDK.getGasEstimationSubmitGovParamsUpdateProposal(
      title,
      summary,
      initialDeposit,
      params,
      metadata
    );
  };

  const cancelProposal = async (proposalId: string, estimatedGas: number) => {
    const result = await FirmaSDK.cancelProposal(proposalId, estimatedGas);
    checkValidateResult(result);
  };

  const getGasEstimationCancelProposal = async (proposalId: string) => {
    return await FirmaSDK.getGasEstimationCancelProposal(proposalId);
  };

  const getStakingGrantDataList = async () => {
    try {
      const firmaSDK = FirmaSDK.getSDK();
      let address = getAddressInternal();

      const grantDataRaw = await firmaSDK.Authz.getStakingGrantData(
        address,
        CHAIN_CONFIG.RESTAKE.ADDRESS,
        AuthorizationType.AUTHORIZATION_TYPE_DELEGATE
      );
      const grantData = grantDataRaw.dataList[0];
      const maxFCT = grantData.authorization.max_tokens ? grantData.authorization.max_tokens.amount : '';
      const expiration = grantData.expiration;
      const allowValidatorList = grantData.authorization.allow_list.address.map((operatorAddress) => {
        const { moniker, avatarURL } = getAvatarInfo(avatarList, operatorAddress);

        return {
          operatorAddress,
          moniker,
          avatarURL,
        };
      });

      return {
        maxFCT,
        expiration,
        allowValidatorList,
      };
    } catch (error) {
      return null;
    }
  };

  const grantStakeAuthorizationDelegate = async (
    validatorAddressList: string[],
    expirationDate: Date,
    maxFCT: number,
    estimatedGas: number
  ) => {
    const result = await FirmaSDK.grantStakeAuthorizationDelegate(
      validatorAddressList,
      expirationDate,
      maxFCT,
      estimatedGas
    );

    checkValidateResult(result);
  };

  const getGasEstimationGrantStakeAuthorizationDelegate = async (
    validatorAddressList: string[],
    expirationDate: Date,
    maxFCT: number
  ) => {
    return await FirmaSDK.getGasEstimationGrantStakeAuthorizationDelegate(validatorAddressList, expirationDate, maxFCT);
  };

  const revokeStakeAuthorizationDelegate = async (estimatedGas: number) => {
    const result = await FirmaSDK.revokeStakeAuthorizationDelegate(estimatedGas);

    checkValidateResult(result);
  };

  const getGasEstimationRevokeStakeAuthorizationDelegate = async () => {
    return await FirmaSDK.getGasEstimationRevokeStakeAuthorizationDelegate();
  };

  const checkValidateResult = (result: any) => {
    if (result.code === undefined) {
      console.log(result);
      enqueueSnackbar(JSON.stringify(result), {
        variant: 'error',
        autoHideDuration: 5000,
      });
      throw new Error('INVALID TX');
    } else if (result.code !== 0) {
      console.log(result);
      enqueueSnackbar(JSON.stringify(result), {
        variant: 'error',
        autoHideDuration: 5000,
      });
      throw new Error('FAILED TX');
    }
  };

  const isValidAddress = (address: string) => {
    return FirmaUtil.isValidAddress(address);
  };

  return {
    initializeFirma,
    checkSession,
    getNewMnemonic,
    storeWalletFromMnemonic,
    storeWalletFromPrivateKey,
    resetWallet,
    loginWallet,
    initWallet,
    connectLedger,
    connectWalletApp,
    showAddressOnDevice,
    getDecryptPrivateKey,
    getDecryptMnemonic,
    isCorrectPassword,
    setUserData,
    getVestingAccount,
    getStaking,
    getStakingFromValidator,
    getDelegationListWithReward,
    getDelegationList,
    getDelegation,
    getRedelegationList,
    getUndelegationList,
    sendFCT,
    sendToken,
    sendIBC,
    delegate,
    redelegate,
    undelegate,
    withdraw,
    withdrawAllValidator,
    submitParameterChangeProposal,
    submitCommunityPoolSpendProposal,
    submitTextProposal,
    submitSoftwareUpgrade,
    submitCancelSoftwareUpgrade,
    submitStakingParamsUpdateProposal,
    submitGovParamsUpdateProposal,
    cancelProposal,
    deposit,
    vote,
    grantStakeAuthorizationDelegate,
    revokeStakeAuthorizationDelegate,
    getStakingGrantDataList,
    getGasEstimationSendFCT,
    getGasEstimationSendToken,
    getGasEstimationsendIBC,
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
    getGasEstimationSubmitCancelSoftwareUpgrade,
    getGasEstimationSubmitStakingParamsUpdateProposal,
    getGasEstimationSubmitGovParamsUpdateProposal,
    getGasEstimationCancelProposal,
    getGasEstimationGrantStakeAuthorizationDelegate,
    getGasEstimationRevokeStakeAuthorizationDelegate,
    isValidWallet,
    isValidAddress,
    downloadPaperWallet,
  };
}

export default useFirma;
