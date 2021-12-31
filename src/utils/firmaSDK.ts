import { FirmaSDK } from "@firmachain/firma-js";
import { FirmaWebLedgerWallet, FirmaBridgeLedgerWallet } from "@firmachain/firma-js-ledger";
import TransportHID from "@ledgerhq/hw-transport-webhid";

import { FIRMACHAIN_CONFIG } from "../config";
import { isElectron } from "./common";

declare global {
  interface Window {
    require: NodeRequire;
    electron: any;
  }
}

const webLedgerWallet = new FirmaWebLedgerWallet(TransportHID);
const bridgeLedgerWallet = new FirmaBridgeLedgerWallet();

const FirmaSDKInternal = ({ isLedger, getDecryptPrivateKey }: any) => {
  const firmaSDK = new FirmaSDK(FIRMACHAIN_CONFIG);

  if (isElectron) {
    bridgeLedgerWallet.registerShowAddressOnDevice(async (): Promise<void> => {
      window.electron.sendSync("ledger-showAddressOnDevice", {});
    });

    bridgeLedgerWallet.registerGetAddressAndPublicKeyCallback(
      async (): Promise<{ address: string; publicKey: Uint8Array }> => {
        return window.electron.sendSync("ledger-getAddressAndPublicKey", {});
      }
    );

    bridgeLedgerWallet.registerGetAddressCallback(async (): Promise<string> => {
      return window.electron.sendSync("ledger-getAddress", {});
    });

    bridgeLedgerWallet.registerGetPublicKeyCallback(async (): Promise<Uint8Array> => {
      return window.electron.sendSync("ledger-getPublicKey", {});
    });

    bridgeLedgerWallet.registerGetSignCallback(async (message: string): Promise<Uint8Array> => {
      return window.electron.sendSync("ledger-sign", { message: message });
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

  const send = async (address: string, amount: number, memo = "") => {
    const wallet = await getWallet();
    const result = await firmaSDK.Bank.send(wallet, address, amount, { memo });

    return result;
  };

  const sendToken = async (address: string, tokenID: string, amount: number, decimal: number, memo = "") => {
    const wallet = await getWallet();
    const result = await firmaSDK.Bank.sendToken(wallet, address, tokenID, amount, decimal, { memo });

    return result;
  };

  const delegate = async (validatorAddress: string, amount: number) => {
    const wallet = await getWallet();
    const result = await firmaSDK.Staking.delegate(wallet, validatorAddress, amount);

    return result;
  };

  const redelegate = async (validatorAddressSrc: string, validatorAddressDst: string, amount: number) => {
    const wallet = await getWallet();
    const result = await firmaSDK.Staking.redelegate(wallet, validatorAddressSrc, validatorAddressDst, amount, {
      fee: 300000,
      gas: 300000,
    });
    return result;
  };

  const undelegate = async (validatorAddress: string, amount: number) => {
    const wallet = await getWallet();
    const result = await firmaSDK.Staking.undelegate(wallet, validatorAddress, amount);

    return result;
  };

  const withdrawAllRewards = async (validatorAddress: string) => {
    const wallet = await getWallet();
    const result = await firmaSDK.Distribution.withdrawAllRewards(wallet, validatorAddress);

    return result;
  };

  const withdrawAllRewardsFromAllValidator = async () => {
    const wallet = await getWallet();
    const delegationList = await firmaSDK.Staking.getTotalDelegationInfo(await wallet.getAddress());
    const gasEstimation = await firmaSDK.Distribution.getGasEstimationWithdrawAllRewardsFromAllValidator(
      wallet,
      delegationList
    );

    const result = await firmaSDK.Distribution.withdrawAllRewardsFromAllValidator(wallet, delegationList, {
      gas: gasEstimation,
      fee: gasEstimation,
    });

    return result;
  };

  const vote = async (proposalId: number, votingType: number) => {
    const wallet = await getWallet();
    const result = await firmaSDK.Gov.vote(wallet, proposalId, votingType);

    return result;
  };

  const deposit = async (proposalId: number, amount: number) => {
    const wallet = await getWallet();
    const result = await firmaSDK.Gov.deposit(wallet, proposalId, amount);

    return result;
  };

  const submitParameterChangeProposal = async (
    title: string,
    description: string,
    initialDeposit: number,
    paramList: Array<any>
  ) => {
    const wallet = await getWallet();
    const result = await firmaSDK.Gov.submitParameterChangeProposal(
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
    recipient: string
  ) => {
    const wallet = await getWallet();
    const result = await firmaSDK.Gov.submitCommunityPoolSpendProposal(
      wallet,
      title,
      description,
      initialDeposit,
      amount,
      recipient
    );

    return result;
  };

  const submitTextProposal = async (title: string, description: string, initialDeposit: number) => {
    const wallet = await getWallet();
    const result = await firmaSDK.Gov.submitTextProposal(wallet, title, description, initialDeposit);

    return result;
  };

  const submitSoftwareUpgradeProposalByHeight = async (
    title: string,
    description: string,
    initialDeposit: number,
    upgradeName: string,
    height: number
  ) => {
    const wallet = await getWallet();
    const result = await firmaSDK.Gov.submitSoftwareUpgradeProposalByHeight(
      wallet,
      title,
      description,
      initialDeposit,
      upgradeName,
      height
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
  };
};

export { FirmaSDKInternal };
