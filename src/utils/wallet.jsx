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
    const newWallet = await getFirmaSDK().Wallet.newWallet();
    walletActions.handleWalletMnemonic(newWallet.getMnemonic());

    setWalletState(newWallet);
  };

  const recoverWalletFromMnemonic = async (mnemonic) => {
    walletActions.handleWalletMnemonic(mnemonic);

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

    const available = numeral(FirmaUtil.getFCTStringFromUFCTStr(balance)).value();
    const delegated = numeral(
      FirmaUtil.getFCTStringFromUFCTStr(
        delegationBalanceList.length > 0
          ? delegationBalanceList.reduce((acc, current) => {
              return numeral(acc).value() + numeral(current).value();
            })
          : 0
      )
    ).value();
    const undelegate = numeral(
      FirmaUtil.getFCTStringFromUFCTStr(
        undelegationBalanceList.length > 0
          ? undelegationBalanceList.reduce((acc, current) => {
              return numeral(acc).value() + numeral(current).value();
            })
          : 0
      )
    ).value();
    const stakingReward = numeral(FirmaUtil.getFCTStringFromUFCTStr(totalReward.total ? totalReward.total : 0)).value();

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
    // const undelegationList = await getFirmaSDK().Staking.getTotalUndelegateInfo(address);
    const totalReward = await getFirmaSDK().Distribution.getTotalRewardInfo(address);

    const targetDelegation = delegationList.find((value) => value.delegation.validator_address === validatorAddress);
    // const targetUndelegate = undelegationList.find((value) => value.validator_address === validatorAddress);
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

  const getDelegation = async (targetValidator) => {
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

  const checkVlidateResult = (result) => {
    if (result.code === undefined) throw new Error("INVALID TX");
    if (result.code !== 0) throw new Error("FAILED TX");
  };

  const sendFCT = async (address, amount, memo = "") => {
    if (!isInit) return;

    const wallet = await getFirmaSDK().Wallet.fromPrivateKey(privateKey);
    const result = await getFirmaSDK().Bank.send(wallet, address, Number(amount), { memo });

    checkVlidateResult(result);
  };

  const delegate = async (validatorAddress, amount) => {
    if (!isInit) return;

    const wallet = await getFirmaSDK().Wallet.fromPrivateKey(privateKey);
    const result = await getFirmaSDK().Staking.delegate(wallet, validatorAddress, amount);
    console.log(result);

    checkVlidateResult(result);
  };

  const redelegate = async (validatorAddressSrc, validatorAddressDst, amount) => {
    if (!isInit) return;

    const wallet = await getFirmaSDK().Wallet.fromPrivateKey(privateKey);
    const result = await getFirmaSDK().Staking.redelegate(wallet, validatorAddressSrc, validatorAddressDst, amount, {
      fee: 3000,
      gas: 300000,
    });
    console.log(result);

    checkVlidateResult(result);
  };

  const undelegate = async (validatorAddress, amount) => {
    if (!isInit) return;

    const wallet = await getFirmaSDK().Wallet.fromPrivateKey(privateKey);
    const result = await getFirmaSDK().Staking.undelegate(wallet, validatorAddress, amount);
    console.log(result);

    checkVlidateResult(result);
  };

  const withdraw = async (validatorAddress) => {
    if (!isInit) return;

    const wallet = await getFirmaSDK().Wallet.fromPrivateKey(privateKey);
    const result = await getFirmaSDK().Distribution.withdrawAllRewards(wallet, validatorAddress);
    console.log(result);

    checkVlidateResult(result);
  };

  const vote = async (proposalId, votingType) => {
    if (!isInit) return;

    const wallet = await getFirmaSDK().Wallet.fromPrivateKey(privateKey);
    const result = await getFirmaSDK().Gov.vote(wallet, proposalId, votingType);
    console.log(result);

    checkVlidateResult(result);
  };

  const deposit = async (proposalId, amount) => {
    if (!isInit) return;

    const wallet = await getFirmaSDK().Wallet.fromPrivateKey(privateKey);
    const result = await getFirmaSDK().Gov.deposit(wallet, proposalId, amount);
    console.log(result);

    checkVlidateResult(result);
  };

  const submitParameterChangeProposal = async (title, description, initialDeposit, paramList) => {
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

  const submitCommunityPoolSpendProposal = async (title, description, initialDeposit, amount, recipient) => {
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

  const submitTextProposal = async (title, description, initialDeposit) => {
    if (!isInit) return;

    const wallet = await getFirmaSDK().Wallet.fromPrivateKey(privateKey);
    const result = await getFirmaSDK().Gov.submitTextProposal(wallet, title, description, initialDeposit);
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
    getDelegationList,
    getDelegation,
    sendFCT,
    convertToFct,
    delegate,
    redelegate,
    undelegate,
    withdraw,
    submitParameterChangeProposal,
    submitCommunityPoolSpendProposal,
    submitTextProposal,
    deposit,
    vote,
    refreshWallet,
  };
}

export default useFirma;
