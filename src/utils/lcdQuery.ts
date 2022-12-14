import { FirmaSDK, FirmaUtil, ValidatorDataType } from '@firmachain/firma-js';

import { IAvatarInfo, IProposalData, ISigningInfo, IValidatorData } from '../interfaces/lcd';
import { DENOM, FIRMACHAIN_CONFIG, SYMBOL } from '../config';
import { convertNumber, convertNumberFormat } from './common';

export {
  getLatestBlock,
  getStakingPool,
  getTotalVotingPower,
  getTotalSupply,
  getInflation,
  getTokenData,
  getValidatorList,
  getValidatorFromAddress,
  getValidatorDelegationsFromAddress,
  getSigningInfos,
  getSignedBlocksWindow,
  getAccAddressFromValOperAddress,
  getProposalList,
  getProposalFromId,
  getAvatarInfoListAll,
};

const firmaSDK = new FirmaSDK(FIRMACHAIN_CONFIG);

const getAccAddressFromValOperAddress = (valoperAddress: string): string => {
  return FirmaUtil.getAccAddressFromValOperAddress(valoperAddress);
};

const getTotalVotingPower = async (): Promise<number> => {
  return convertNumber(FirmaUtil.getFCTStringFromUFCTStr((await firmaSDK.Staking.getPool()).bonded_tokens));
};

const getStakingPool = async (): Promise<{ bondedTokens: number; unbondedTokens: number }> => {
  const stakingPool = await firmaSDK.Staking.getPool();

  return {
    bondedTokens: convertNumber(FirmaUtil.getFCTStringFromUFCTStr(stakingPool.bonded_tokens)),
    unbondedTokens: convertNumber(FirmaUtil.getFCTStringFromUFCTStr(stakingPool.not_bonded_tokens)),
  };
};

const getTotalSupply = async (): Promise<number> => {
  try {
    const amount = await firmaSDK.Bank.getSupply();

    return convertNumber(FirmaUtil.getFCTStringFromUFCTStr(amount));
  } catch (error) {
    return 0;
  }
};

const getInflation = async (): Promise<number> => {
  try {
    const inflation = await firmaSDK.Mint.getInflation();

    return convertNumber(inflation);
  } catch (error) {
    return 0;
  }
};

const getLatestBlock = async (): Promise<number> => {
  let block = '0';

  try {
    const result = await firmaSDK.BlockChain.getChainSyncInfo();
    block = result.latest_block_height;
  } catch (error) {}

  return convertNumber(block);
};

const getSignedBlocksWindow = async (): Promise<number> => {
  try {
    const { signed_blocks_window } = await firmaSDK.Slashing.getSlashingParam();

    return convertNumber(signed_blocks_window);
  } catch (error) {
    return 0;
  }
};

const getSigningInfos = async (): Promise<ISigningInfo[]> => {
  const signingInfos = await firmaSDK.Slashing.getSigningInfos();

  return signingInfos;
};

const getTokenData = async (denom: string): Promise<{ denom: string; symbol: string; decimal: number }> => {
  if (denom !== DENOM) {
    const tokenData = await firmaSDK.Token.getTokenData(denom);

    return {
      denom: denom,
      symbol: tokenData.symbol,
      decimal: tokenData.decimal,
    };
  }

  return {
    denom: DENOM,
    symbol: SYMBOL,
    decimal: 6,
  };
};

const getValidatorDelegationsFromAddress = async (
  valoperAddress: string
): Promise<{ delegatorAddress: string; moniker: string; avatarURL: string; amount: number }[]> => {
  const delegationData = await firmaSDK.Staking.getDelegationListFromValidator(valoperAddress);

  let result: { delegatorAddress: string; moniker: string; avatarURL: string; amount: number }[] = [];
  for (let delegation of delegationData.dataList) {
    result.push({
      delegatorAddress: delegation.delegation.delegator_address,
      moniker: delegation.delegation.delegator_address,
      avatarURL: '',
      amount: convertNumber(delegation.balance.amount),
    });
  }

  return result;
};

const getValidatorList = async (): Promise<IValidatorData[]> => {
  const validatorDataList = (await firmaSDK.Staking.getValidatorList()).dataList;
  const totalVotingPower = await getTotalVotingPower();
  const avatarInfoList = await getAvatarInfoListAll();

  let validatorList: IValidatorData[] = [];
  for (let validator of validatorDataList) {
    validatorList.push(parseValidator(validator, totalVotingPower, avatarInfoList));
  }

  return validatorList;
};

const getValidatorFromAddress = async (valoperAddress: string): Promise<IValidatorData> => {
  const validator = await firmaSDK.Staking.getValidator(valoperAddress);
  const totalVotingPower = await getTotalVotingPower();
  const avatarInfoList = await getAvatarInfoListAll();

  return parseValidator(validator, totalVotingPower, avatarInfoList);
};

const parseValidator = (validator: ValidatorDataType, totalVotingPower: number, avatarInfoList: IAvatarInfo[]) => {
  const validatorAddress = validator.operator_address;
  const validatorMoniker = validator.description.moniker;
  const validatorDetail = validator.description.details;
  const validatorWebsite = validator.description.website;
  const jailed = validator.jailed;
  const status = validator.status;
  const selfDelegateAddress = FirmaUtil.getAccAddressFromValOperAddress(validator.operator_address);
  const valconsAddress = FirmaUtil.getValConsAddressFromAccAddress(validator.consensus_pubkey.key);

  const votingPower = convertNumber(FirmaUtil.getFCTStringFromUFCTStr(validator.tokens));
  const votingPowerPercent = convertNumberFormat(+(votingPower / totalVotingPower).toFixed(5) * 100, 2);
  const commission = convertNumber(validator.commission.commission_rates.rate);

  let validatorAvatar = '';
  for (let avatarInfo of avatarInfoList) {
    if (avatarInfo.operatorAddress === validatorAddress) {
      validatorAvatar = avatarInfo.url;
    }
  }

  return {
    validatorAddress,
    validatorMoniker,
    validatorAvatar,
    validatorDetail,
    validatorWebsite,
    selfDelegateAddress,
    valconsAddress,
    votingPower,
    votingPowerPercent,
    commission,
    status,
    jailed,
  };
};

const getProposalList = async (): Promise<IProposalData[]> => {
  const proposalList = await firmaSDK.Gov.getProposalList();
  const proposalParams = await firmaSDK.Gov.getParam();

  const formatExtraData = (proposalContent: any) => {
    if (proposalContent.plan) {
      return {
        height: proposalContent.plan.height,
        name: proposalContent.plan.name,
        info: proposalContent.plan.info,
      };
    }
    if (proposalContent.recipient) {
      return {
        recipient: proposalContent.recipient,
        amount: proposalContent.amount[0].amount,
      };
    }
    if (proposalContent.changes) {
      return {
        changes: proposalContent.changes,
      };
    }

    return null;
  };

  let result: IProposalData[] = [];
  for (let proposal of proposalList) {
    const proposalId = proposal.proposal_id;
    const status = proposal.status;
    const title = proposal.content.title;
    const description = proposal.content.description;
    const proposalType = proposal.content['@type'];
    const submitTime = proposal.submit_time;
    const extraData = formatExtraData(proposal.content);

    const votingStartTime = proposal.voting_start_time;
    const votingEndTime = proposal.voting_end_time;
    const paramQuorum = convertNumber(proposalParams.tally_params.quorum);
    const paramMinDepositAmount = convertNumber(proposalParams.deposit_params.min_deposit[0].amount);
    const periodDeposit = convertNumber(proposalParams.deposit_params.max_deposit_period);

    result.push({
      proposalId,
      status,
      title,
      description,
      proposalType,
      submitTime,
      extraData,
      votingStartTime,
      votingEndTime,
      paramQuorum,
      paramMinDepositAmount,
      periodDeposit,
      tally: {
        yes: 0,
        no: 0,
        noWithVeto: 0,
        abstain: 0,
      },
    });
  }

  result.sort((a: any, b: any) => b.proposalId - a.proposalId);

  return result;
};

const getProposalFromId = async (proposalId: string): Promise<IProposalData> => {
  const proposal = await firmaSDK.Gov.getProposal(proposalId);
  const proposalParams = await firmaSDK.Gov.getParam();
  const tallyRaw = await firmaSDK.Gov.getCurrentVoteInfo(proposalId);

  const formatExtraData = (proposalContent: any) => {
    if (proposalContent.plan) {
      return {
        height: proposalContent.plan.height,
        name: proposalContent.plan.name,
        info: proposalContent.plan.info,
      };
    }
    if (proposalContent.recipient) {
      return {
        recipient: proposalContent.recipient,
        amount: proposalContent.amount[0].amount,
      };
    }
    if (proposalContent.changes) {
      return {
        changes: proposalContent.changes,
      };
    }

    return null;
  };

  const status = proposal.status;
  const title = proposal.content.title;
  const description = proposal.content.description;
  const proposalType = proposal.content['@type'];
  const submitTime = proposal.submit_time;
  const extraData = formatExtraData(proposal.content);

  const votingStartTime = proposal.voting_start_time;
  const votingEndTime = proposal.voting_end_time;
  const paramQuorum = convertNumber(proposalParams.tally_params.quorum);
  const paramMinDepositAmount = convertNumber(proposalParams.deposit_params.min_deposit[0].amount);
  const periodDeposit = convertNumber(proposalParams.deposit_params.max_deposit_period);

  const tally = {
    yes: convertNumber(tallyRaw.yes),
    no: convertNumber(tallyRaw.no),
    noWithVeto: convertNumber(tallyRaw.no_with_veto),
    abstain: convertNumber(tallyRaw.abstain),
  };

  return {
    proposalId,
    status,
    title,
    description,
    proposalType,
    submitTime,
    extraData,
    votingStartTime,
    votingEndTime,
    paramQuorum,
    paramMinDepositAmount,
    periodDeposit,
    tally,
  };
};

const getAvatarInfoListAll = async (): Promise<IAvatarInfo[]> => {
  return [];
};
