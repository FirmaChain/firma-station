import { FirmaSDK, AuthorizationType } from '@firmachain/firma-js';
import { FirmaWebLedgerWallet, FirmaBridgeLedgerWallet } from '@firmachain/firma-js-ledger';
import TransportHID from '@ledgerhq/hw-transport-webhid';

import { CHAIN_CONFIG, IBC_CONFIG } from '../config';
import { convertToUTokenStringFromToken, getDefaultGas, getFeesFromGas, isElectron, isExternalConnect } from './common';
import Long from 'long';

declare global {
  interface Window {
    require: NodeRequire;
    electron: any;
  }
}

const webLedgerWallet = new FirmaWebLedgerWallet(TransportHID);
const bridgeLedgerWallet = new FirmaBridgeLedgerWallet();

const FirmaSDKInternal = ({ isLedger, isMobileApp, getDecryptPrivateKey }: any) => {
  const firmaSDK = new FirmaSDK(CHAIN_CONFIG.FIRMACHAIN_CONFIG);

  if (isElectron) {
    bridgeLedgerWallet.registerShowAddressOnDevice(async (): Promise<void> => {
      window.electron.sendSync('ledger-showAddressOnDevice', {});
    });

    bridgeLedgerWallet.registerGetAddressAndPublicKeyCallback(
      async (): Promise<{ address: string; publicKey: Uint8Array }> => {
        return window.electron.sendSync('ledger-getAddressAndPublicKey', {});
      }
    );

    bridgeLedgerWallet.registerGetAddressCallback(async (): Promise<string> => {
      return window.electron.sendSync('ledger-getAddress', {});
    });

    bridgeLedgerWallet.registerGetPublicKeyCallback(async (): Promise<Uint8Array> => {
      return window.electron.sendSync('ledger-getPublicKey', {});
    });

    bridgeLedgerWallet.registerGetSignCallback(async (message: string): Promise<Uint8Array> => {
      return window.electron.sendSync('ledger-sign', { message: message });
    });
  }

  const showAddressOnDevice = async () => {
    if (isElectron) {
      return await bridgeLedgerWallet.showAddressOnDevice();
    } else {
      return await webLedgerWallet.showAddressOnDevice();
    }
  };

  const connectLedger = async () => {
    if (isElectron) {
      return await bridgeLedgerWallet.getAddress();
    } else {
      return await webLedgerWallet.getAddress();
    }
  };

  const getSDK = () => {
    return firmaSDK;
  };

  const getFees = (estimatedGas: number) => {
    return getFeesFromGas(estimatedGas);
  };

  const getWallet = async () => {
    if (isLedger) {
      if (isElectron) {
        return await firmaSDK.Wallet.initFromLedger(bridgeLedgerWallet);
      } else {
        return await firmaSDK.Wallet.initFromLedger(webLedgerWallet);
      }
    } else {
      const privateKey = getDecryptPrivateKey();

      return await firmaSDK.Wallet.fromPrivateKey(privateKey);
    }
  };

  const send = async (address: string, amount: number, memo = '', estimatedGas: number) => {
    const wallet = await getWallet();
    const result = await firmaSDK.Bank.send(wallet, address, amount, {
      memo,
      gas: estimatedGas,
      fee: getFees(estimatedGas),
    });

    return result;
  };

  const getGasEstimationSend = async (address: string, amount: number, memo = '') => {
    if (isExternalConnect(isLedger, isMobileApp) || CHAIN_CONFIG.IS_DEFAULT_GAS)
      return getDefaultGas(isLedger, isMobileApp);

    const wallet = await getWallet();
    const gasEstimation = await firmaSDK.Bank.getGasEstimationSend(wallet, address, amount, { memo });

    return gasEstimation;
  };

  const sendToken = async (
    address: string,
    tokenID: string,
    amount: number,
    decimal: number,
    memo = '',
    estimatedGas: number
  ) => {
    const wallet = await getWallet();
    const result = await firmaSDK.Bank.sendToken(wallet, address, tokenID, amount, decimal, {
      memo,
      gas: estimatedGas,
      fee: getFees(estimatedGas),
    });

    return result;
  };

  const getGasEstimationSendToken = async (
    address: string,
    tokenID: string,
    amount: number,
    decimal: number,
    memo = ''
  ) => {
    if (isExternalConnect(isLedger, isMobileApp) || CHAIN_CONFIG.IS_DEFAULT_GAS)
      return getDefaultGas(isLedger, isMobileApp);

    const wallet = await getWallet();
    const gasEstimation = await firmaSDK.Bank.getGasEstimationSendToken(wallet, address, tokenID, amount, decimal, {
      memo,
    });

    return gasEstimation;
  };

  const sendIBC = async (
    address: string,
    amount: number,
    denom: string,
    decimal: number,
    memo = '',
    estimatedGas: number
  ) => {
    const wallet = await getWallet();

    let port = '';
    let channel = '';

    if (denom === 'ufct') {
      port = 'transfer';
      channel = 'channel-1';
    } else {
      const ibcConfig = IBC_CONFIG[denom];
      port = ibcConfig.port;
      channel = ibcConfig.channel;
    }

    const convertAmount = convertToUTokenStringFromToken(amount, decimal);
    const clientState = await firmaSDK.Ibc.getClientState(channel, port);
    const timeStamp = (Date.now() + 600000).toString() + '000000';
    const timeoutTimeStamp = Long.fromString(timeStamp, true);
    const height = {
      revisionHeight: Long.fromString(
        clientState.identified_client_state.client_state.latest_height.revision_height,
        true
      ).add(Long.fromNumber(1000)),
      revisionNumber: Long.fromString(
        clientState.identified_client_state.client_state.latest_height.revision_number,
        true
      ),
    };

    const result = await firmaSDK.Ibc.transfer(
      wallet,
      port,
      channel,
      denom,
      convertAmount,
      address,
      height,
      timeoutTimeStamp,
      { memo, gas: estimatedGas, fee: getFees(estimatedGas) }
    );

    return result;
  };

  const getGasEstimationSendIBC = async (
    address: string,
    amount: number,
    denom: string,
    decimal: number,
    memo = ''
  ) => {
    if (isExternalConnect(isLedger, isMobileApp) || CHAIN_CONFIG.IS_DEFAULT_GAS)
      return getDefaultGas(isLedger, isMobileApp);

    const wallet = await getWallet();

    let port = '';
    let channel = '';

    if (denom === 'ufct') {
      port = 'transfer';
      channel = 'channel-1';
    } else {
      const ibcConfig = IBC_CONFIG[denom];
      port = ibcConfig.port;
      channel = ibcConfig.channel;
    }

    const convertAmount = convertToUTokenStringFromToken(amount, decimal);
    const clientState = await firmaSDK.Ibc.getClientState(channel, port);
    const timeStamp = (Date.now() + 600000).toString() + '000000';
    const timeoutTimeStamp = Long.fromString(timeStamp, true);
    const height = {
      revisionHeight: Long.fromString(
        clientState.identified_client_state.client_state.latest_height.revision_height,
        true
      ).add(Long.fromNumber(1000)),
      revisionNumber: Long.fromString(
        clientState.identified_client_state.client_state.latest_height.revision_number,
        true
      ),
    };

    try {
      const gasEstimation = await firmaSDK.Ibc.getGasEstimationTransfer(
        wallet,
        port,
        channel,
        denom,
        convertAmount,
        address,
        height,
        timeoutTimeStamp,
        { memo }
      );

      return gasEstimation;
    } catch (e) {
      console.error(e);
    }
    return 0;
  };

  const delegate = async (validatorAddress: string, amount: number, estimatedGas: number) => {
    const wallet = await getWallet();
    const result = await firmaSDK.Staking.delegate(wallet, validatorAddress, amount, {
      gas: estimatedGas,
      fee: getFees(estimatedGas),
    });

    return result;
  };

  const getGasEstimationDelegate = async (validatorAddress: string, amount: number) => {
    if (isExternalConnect(isLedger, isMobileApp) || CHAIN_CONFIG.IS_DEFAULT_GAS)
      return getDefaultGas(isLedger, isMobileApp);

    const wallet = await getWallet();
    const result = await firmaSDK.Staking.getGasEstimationDelegate(wallet, validatorAddress, amount);

    return result;
  };

  const redelegate = async (
    validatorAddressSrc: string,
    validatorAddressDst: string,
    amount: number,
    estimatedGas: number
  ) => {
    const wallet = await getWallet();
    const result = await firmaSDK.Staking.redelegate(wallet, validatorAddressSrc, validatorAddressDst, amount, {
      gas: estimatedGas,
      fee: getFees(estimatedGas),
    });
    return result;
  };

  const getGasEstimationRedelegate = async (
    validatorAddressSrc: string,
    validatorAddressDst: string,
    amount: number
  ) => {
    if (isExternalConnect(isLedger, isMobileApp)) return getDefaultGas(isLedger, isMobileApp);

    const wallet = await getWallet();
    const result = await firmaSDK.Staking.getGasEstimationRedelegate(
      wallet,
      validatorAddressSrc,
      validatorAddressDst,
      amount
    );

    return result;
  };

  const undelegate = async (validatorAddress: string, amount: number, estimatedGas: number) => {
    const wallet = await getWallet();
    const result = await firmaSDK.Staking.undelegate(wallet, validatorAddress, amount, {
      gas: estimatedGas,
      fee: getFees(estimatedGas),
    });

    return result;
  };

  const getGasEstimationUndelegate = async (validatorAddress: string, amount: number) => {
    if (isExternalConnect(isLedger, isMobileApp) || CHAIN_CONFIG.IS_DEFAULT_GAS)
      return getDefaultGas(isLedger, isMobileApp);

    const wallet = await getWallet();
    const result = await firmaSDK.Staking.getGasEstimationUndelegate(wallet, validatorAddress, amount);

    return result;
  };

  const withdrawAllRewards = async (validatorAddress: string, estimatedGas: number) => {
    const wallet = await getWallet();
    const result = await firmaSDK.Distribution.withdrawAllRewards(wallet, validatorAddress, {
      gas: estimatedGas,
      fee: getFees(estimatedGas),
    });

    return result;
  };

  const getGasEstimationWithdrawAllRewards = async (validatorAddress: string) => {
    if (isExternalConnect(isLedger, isMobileApp) || CHAIN_CONFIG.IS_DEFAULT_GAS)
      return getDefaultGas(isLedger, isMobileApp);

    const wallet = await getWallet();
    const result = await firmaSDK.Distribution.getGasEstimationWithdrawAllRewards(wallet, validatorAddress);

    return result;
  };

  const withdrawAllRewardsFromAllValidator = async (estimatedGas: number) => {
    const wallet = await getWallet();
    const delegationList = (await firmaSDK.Staking.getTotalDelegationInfo(await wallet.getAddress())).dataList;

    const result = await firmaSDK.Distribution.withdrawAllRewardsFromAllValidator(wallet, delegationList, {
      gas: estimatedGas,
      fee: getFees(estimatedGas),
    });

    return result;
  };

  const getGasEstimationWithdrawAllRewardsFromAllValidator = async () => {
    if (isExternalConnect(isLedger, isMobileApp)) return getDefaultGas(isLedger, isMobileApp);

    const wallet = await getWallet();
    const delegationList = (await firmaSDK.Staking.getTotalDelegationInfo(await wallet.getAddress())).dataList;
    const gasEstimation = await firmaSDK.Distribution.getGasEstimationWithdrawAllRewardsFromAllValidator(
      wallet,
      delegationList
    );

    return gasEstimation;
  };

  const vote = async (proposalId: number, votingType: number, estimatedGas: number) => {
    const wallet = await getWallet();
    const result = await firmaSDK.Gov.vote(wallet, proposalId, votingType, {
      gas: estimatedGas,
      fee: getFees(estimatedGas),
    });

    return result;
  };

  const getGasEstimationVote = async (proposalId: number, votingType: number) => {
    if (isExternalConnect(isLedger, isMobileApp) || CHAIN_CONFIG.IS_DEFAULT_GAS)
      return getDefaultGas(isLedger, isMobileApp);

    const wallet = await getWallet();
    const result = await firmaSDK.Gov.getGasEstimationVote(wallet, proposalId, votingType);

    return result;
  };

  const deposit = async (proposalId: number, amount: number, estimatedGas: number) => {
    const wallet = await getWallet();
    const result = await firmaSDK.Gov.deposit(wallet, proposalId, amount, {
      gas: estimatedGas,
      fee: getFees(estimatedGas),
    });

    return result;
  };

  const getGasEstimationDeposit = async (proposalId: number, amount: number) => {
    if (isExternalConnect(isLedger, isMobileApp) || CHAIN_CONFIG.IS_DEFAULT_GAS)
      return getDefaultGas(isLedger, isMobileApp);

    const wallet = await getWallet();
    const result = await firmaSDK.Gov.getGasEstimationDeposit(wallet, proposalId, amount);

    return result;
  };

  const submitParameterChangeProposal = async (
    title: string,
    description: string,
    initialDeposit: number,
    paramList: any[],
    estimatedGas: number
  ) => {
    const wallet = await getWallet();
    const result = await firmaSDK.Gov.submitParameterChangeProposal(
      wallet,
      title,
      description,
      initialDeposit,
      paramList,
      {
        gas: estimatedGas,
        fee: getFees(estimatedGas),
      }
    );

    return result;
  };

  const getGasEstimationSubmitParameterChangeProposal = async (
    title: string,
    description: string,
    initialDeposit: number,
    paramList: any[]
  ) => {
    if (isExternalConnect(isLedger, isMobileApp) || CHAIN_CONFIG.IS_DEFAULT_GAS)
      return getDefaultGas(isLedger, isMobileApp);

    const wallet = await getWallet();
    const result = await firmaSDK.Gov.getGasEstimationSubmitParameterChangeProposal(
      wallet,
      title,
      description,
      initialDeposit,
      paramList
    );

    return result;
  };

  const submitCommunityPoolSpendProposal = async (
    title: string,
    description: string,
    initialDeposit: number,
    amount: number,
    recipient: string,
    estimatedGas: number
  ) => {
    const wallet = await getWallet();
    const result = await firmaSDK.Gov.submitCommunityPoolSpendProposal(
      wallet,
      title,
      description,
      initialDeposit,
      amount,
      recipient,
      {
        gas: estimatedGas,
        fee: getFees(estimatedGas),
      }
    );

    return result;
  };

  const getGasEstimationSubmitCommunityPoolSpendProposal = async (
    title: string,
    description: string,
    initialDeposit: number,
    amount: number,
    recipient: string
  ) => {
    if (isExternalConnect(isLedger, isMobileApp) || CHAIN_CONFIG.IS_DEFAULT_GAS)
      return getDefaultGas(isLedger, isMobileApp);

    const wallet = await getWallet();
    const result = await firmaSDK.Gov.getGasEstimationSubmitCommunityPoolSpendProposal(
      wallet,
      title,
      description,
      initialDeposit,
      amount,
      recipient
    );

    return result;
  };

  const submitTextProposal = async (
    title: string,
    description: string,
    initialDeposit: number,
    estimatedGas: number
  ) => {
    const wallet = await getWallet();
    const result = await firmaSDK.Gov.submitTextProposal(wallet, title, description, initialDeposit, {
      gas: estimatedGas,
      fee: getFees(estimatedGas),
    });

    return result;
  };

  const getGasEstimationSubmitTextProposal = async (title: string, description: string, initialDeposit: number) => {
    if (isExternalConnect(isLedger, isMobileApp) || CHAIN_CONFIG.IS_DEFAULT_GAS)
      return getDefaultGas(isLedger, isMobileApp);

    const wallet = await getWallet();
    const result = await firmaSDK.Gov.getGasEstimationSubmitTextProposal(wallet, title, description, initialDeposit);

    return result;
  };

  const submitSoftwareUpgradeProposalByHeight = async (
    title: string,
    description: string,
    initialDeposit: number,
    upgradeName: string,
    height: number,
    estimatedGas: number
  ) => {
    const wallet = await getWallet();
    const result = await firmaSDK.Gov.submitSoftwareUpgradeProposalByHeight(
      wallet,
      title,
      description,
      initialDeposit,
      upgradeName,
      height,
      {
        gas: estimatedGas,
        fee: getFees(estimatedGas),
      }
    );

    return result;
  };

  const getGasEstimationSubmitSoftwareUpgradeProposalByHeight = async (
    title: string,
    description: string,
    initialDeposit: number,
    upgradeName: string,
    height: number
  ) => {
    if (isExternalConnect(isLedger, isMobileApp) || CHAIN_CONFIG.IS_DEFAULT_GAS)
      return getDefaultGas(isLedger, isMobileApp);

    const wallet = await getWallet();
    const result = await firmaSDK.Gov.getGasEstimationSubmitSoftwareUpgradeProposalByHeight(
      wallet,
      title,
      description,
      initialDeposit,
      upgradeName,
      height
    );

    return result;
  };

  const submitCancelSoftwareUpgradeProposal = async (
    title: string,
    description: string,
    initialDeposit: number,
    estimatedGas: number
  ) => {
    const wallet = await getWallet();
    const result = await firmaSDK.Gov.submitCancelSoftwareUpgradeProposal(wallet, title, description, initialDeposit, {
      gas: estimatedGas,
      fee: getFees(estimatedGas),
    });

    return result;
  };

  const getGasEstimationSubmitCancelSoftwareUpgradeProposal = async (
    title: string,
    description: string,
    initialDeposit: number
  ) => {
    if (isExternalConnect(isLedger, isMobileApp) || CHAIN_CONFIG.IS_DEFAULT_GAS)
      return getDefaultGas(isLedger, isMobileApp);

    const wallet = await getWallet();
    const result = await firmaSDK.Gov.getGasEstimationSubmitCancelSoftwareUpgradeProposal(
      wallet,
      title,
      description,
      initialDeposit
    );

    return result;
  };

  const grantStakeAuthorizationDelegate = async (
    validatorAddressList: string[],
    expirationDate: Date,
    maxFCT: number,
    estimatedGas: number
  ) => {
    const wallet = await getWallet();
    const result = await firmaSDK.Authz.grantStakeAuthorization(
      wallet,
      CHAIN_CONFIG.RESTAKE.ADDRESS,
      validatorAddressList,
      AuthorizationType.AUTHORIZATION_TYPE_DELEGATE,
      expirationDate,
      maxFCT,
      {
        gas: estimatedGas,
        fee: getFees(estimatedGas),
      }
    );

    return result;
  };

  const getGasEstimationGrantStakeAuthorizationDelegate = async (
    validatorAddressList: string[],
    expirationDate: Date,
    maxFCT: number
  ) => {
    if (isExternalConnect(isLedger, isMobileApp) || CHAIN_CONFIG.IS_DEFAULT_GAS)
      return getDefaultGas(isLedger, isMobileApp);

    const wallet = await getWallet();
    const result = await firmaSDK.Authz.getGasEstimationGrantStakeAuthorization(
      wallet,
      CHAIN_CONFIG.RESTAKE.ADDRESS,
      validatorAddressList,
      AuthorizationType.AUTHORIZATION_TYPE_DELEGATE,
      expirationDate,
      maxFCT
    );

    return result;
  };

  const revokeStakeAuthorizationDelegate = async (estimatedGas: number) => {
    const wallet = await getWallet();
    const result = await firmaSDK.Authz.revokeStakeAuthorization(
      wallet,
      CHAIN_CONFIG.RESTAKE.ADDRESS,
      AuthorizationType.AUTHORIZATION_TYPE_DELEGATE,
      {
        gas: estimatedGas,
        fee: getFees(estimatedGas),
      }
    );

    return result;
  };

  const getGasEstimationRevokeStakeAuthorizationDelegate = async () => {
    if (isExternalConnect(isLedger, isMobileApp) || CHAIN_CONFIG.IS_DEFAULT_GAS)
      return getDefaultGas(isLedger, isMobileApp);

    const wallet = await getWallet();
    const result = await firmaSDK.Authz.getGasEstimationRevokeStakeAuthorization(
      wallet,
      CHAIN_CONFIG.RESTAKE.ADDRESS,
      AuthorizationType.AUTHORIZATION_TYPE_DELEGATE
    );

    return result;
  };

  return {
    getSDK,
    showAddressOnDevice,
    connectLedger,
    getWallet,
    send,
    sendToken,
    sendIBC,
    delegate,
    redelegate,
    undelegate,
    withdrawAllRewards,
    withdrawAllRewardsFromAllValidator,
    vote,
    deposit,
    submitParameterChangeProposal,
    submitCommunityPoolSpendProposal,
    submitTextProposal,
    submitSoftwareUpgradeProposalByHeight,
    submitCancelSoftwareUpgradeProposal,
    grantStakeAuthorizationDelegate,
    revokeStakeAuthorizationDelegate,

    getGasEstimationSend,
    getGasEstimationSendToken,
    getGasEstimationSendIBC,
    getGasEstimationDelegate,
    getGasEstimationRedelegate,
    getGasEstimationUndelegate,
    getGasEstimationWithdrawAllRewards,
    getGasEstimationWithdrawAllRewardsFromAllValidator,
    getGasEstimationVote,
    getGasEstimationDeposit,
    getGasEstimationSubmitParameterChangeProposal,
    getGasEstimationSubmitCommunityPoolSpendProposal,
    getGasEstimationSubmitTextProposal,
    getGasEstimationSubmitSoftwareUpgradeProposalByHeight,
    getGasEstimationSubmitCancelSoftwareUpgradeProposal,
    getGasEstimationGrantStakeAuthorizationDelegate,
    getGasEstimationRevokeStakeAuthorizationDelegate,
  };
};

export { FirmaSDKInternal };
