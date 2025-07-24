//! Note: Proposal list data is snake_case, but interface is CamelCase (not match)

import { FirmaSDK, FirmaUtil, ValidatorDataType } from '@firmachain/firma-js';

import { IProposalData, ISigningInfo, IValidatorData } from '../interfaces/lcd';
import { CHAIN_CONFIG } from '../config';
import { convertNumber, convertNumberFormat } from './common';
import { StakingValidatorStatus } from '@firmachain/firma-js/dist/sdk/FirmaStakingService';
import { TmpCurrentVoteInfo } from '../interfaces/governance';

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
  getProposalFromId
};

const firmaSDK = new FirmaSDK(CHAIN_CONFIG.FIRMACHAIN_CONFIG);

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
    unbondedTokens: convertNumber(FirmaUtil.getFCTStringFromUFCTStr(stakingPool.not_bonded_tokens))
  };
};

const getTotalSupply = async (): Promise<number> => {
  try {
    const amount = await firmaSDK.Bank.getTokenSupply(CHAIN_CONFIG.PARAMS.DENOM);
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
  if (denom !== CHAIN_CONFIG.PARAMS.DENOM) {
    const tokenData = await firmaSDK.Token.getTokenData(denom);

    return {
      denom: denom,
      symbol: tokenData.symbol,
      decimal: tokenData.decimal
    };
  }

  return {
    denom: CHAIN_CONFIG.PARAMS.DENOM,
    symbol: CHAIN_CONFIG.PARAMS.SYMBOL,
    decimal: 6
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
      amount: convertNumber(delegation.balance.amount)
    });
  }

  return result;
};

const getValidatorList = async (): Promise<IValidatorData[]> => {
  const firstValidatorList = await firmaSDK.Staking.getValidatorList();

  let dataList: ValidatorDataType[] = firstValidatorList.dataList;
  let nextKey: string = firstValidatorList.pagination.next_key;

  while (nextKey !== null) {
    const nextValidatorList = await firmaSDK.Staking.getValidatorList(StakingValidatorStatus.ALL, nextKey);
    const nextDataList = nextValidatorList.dataList;
    nextKey = nextValidatorList.pagination.next_key;

    dataList.push(...nextDataList);
  }

  const validatorDataList = dataList;
  const totalVotingPower = await getTotalVotingPower();

  let validatorList: IValidatorData[] = [];
  for (let validator of validatorDataList) {
    validatorList.push(parseValidator(validator, totalVotingPower));
  }

  return validatorList;
};

const getValidatorFromAddress = async (valoperAddress: string): Promise<IValidatorData> => {
  const validator = await firmaSDK.Staking.getValidator(valoperAddress);
  const totalVotingPower = await getTotalVotingPower();

  return parseValidator(validator, totalVotingPower);
};

const parseValidator = (validator: ValidatorDataType, totalVotingPower: number) => {
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

  return {
    validatorAddress,
    validatorMoniker,
    validatorAvatar: '',
    validatorDetail,
    validatorWebsite,
    selfDelegateAddress,
    valconsAddress,
    votingPower,
    votingPowerPercent,
    commission,
    status,
    jailed
  };
};

const getProposalList = async (): Promise<IProposalData[]> => {
  const proposalList = await firmaSDK.Gov.getProposalList();
  const proposalParams = await firmaSDK.Gov.getParamAsGovParams();

  const formatExtraData = (proposalContent: any) => {
    if (proposalContent.plan) {
      return {
        height: proposalContent.plan.height,
        name: proposalContent.plan.name,
        info: proposalContent.plan.info
      };
    }
    if (proposalContent.recipient) {
      return {
        recipient: proposalContent.recipient,
        amount: proposalContent.amount[0].amount
      };
    }
    if (proposalContent.changes) {
      return {
        changes: proposalContent.changes
      };
    }

    return null;
  };

  let result: IProposalData[] = [];
  for (let proposal of proposalList) {
    const _proposal = proposal as any;

    const proposalId = proposal.id.toString(); // Replaced from proposal.proposal_id
    const status = proposal.status.toString();
    const title = proposal.title; // Replaced from proposal.content.title
    const description = proposal.summary; // Replaced from proposal.content.description

    const firstMsg = proposal.messages[0] as any;
    const firmsMsgContent = firstMsg?.content || null;

    //? Remove 'Msg' from the start
    const proposalType = (firmsMsgContent ? firmsMsgContent['@type'] : firstMsg['@type'] || '').replace('Msg', ''); //? Need to check

    const submitTime = _proposal.submit_time; // Replaced from proposal.submit_time
    const extraData = formatExtraData(proposal.messages); // Replaced from proposal.content

    const votingStartTime = _proposal.voting_start_time; // Replaced from proposal.voting_start_time
    const votingEndTime = _proposal.voting_end_time; // Replaced from proposal.voting_end_time
    const paramQuorum = convertNumber(proposalParams.quorum); // Replaced from proposalParams.tally_params.quorum
    const paramMinDepositAmount = convertNumber(proposalParams.minDeposit[0].amount); // Replaced from proposalParams.deposit_params.min_deposit[0].amount
    const periodDeposit = convertNumber(proposalParams.maxDepositPeriod?.seconds.toString()); // Replaced from proposalParams.deposit_params.max_deposit_period

    const proposer = proposal.proposer;

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
      proposer,
      tally: {
        yes: 0,
        no: 0,
        noWithVeto: 0,
        abstain: 0
      }
    });
  }

  result.sort((a: any, b: any) => b.proposalId - a.proposalId);

  return result;
};

const getProposalFromId = async (proposalId: string): Promise<IProposalData> => {
  const proposal = await firmaSDK.Gov.getProposal(proposalId);
  const proposalParams = await firmaSDK.Gov.getParamAsGovParams();

  //! Note: changed type intentionally to match current return interface. Remove this if tally type is fixed
  const tallyRaw = (await firmaSDK.Gov.getCurrentVoteInfo(proposalId)) as unknown as TmpCurrentVoteInfo;

  const formatExtraData = (proposalContent: any) => {
    if (proposalContent.plan) {
      return {
        height: proposalContent.plan.height,
        name: proposalContent.plan.name,
        info: proposalContent.plan.info
      };
    }
    if (proposalContent.recipient) {
      return {
        recipient: proposalContent.recipient,
        amount: proposalContent.amount[0].amount
      };
    }
    if (proposalContent.changes) {
      return {
        changes: proposalContent.changes
      };
    }

    return null;
  };

  const _proposal = proposal as any;

  const status = proposal.status.toString();
  const title = proposal.title; // Replaced from proposal.content.title
  const description = proposal.summary; // Replaced from proposal.content.description

  const firstMsg = proposal.messages[0] as any;
  const firmsMsgContent = firstMsg?.content || null;

  const proposalType = firmsMsgContent ? firmsMsgContent['@type'] : firstMsg['@type'] || ''; //? Need to check

  const submitTime = _proposal.submit_time; // Replaced from proposal.submit_time

  // Proposal before before v0.5.0 has extraData in firstMsg / after v0.5.0 has extraData in firmsMsgContent
  // So just merge them into one object to reduct complexity
  const extraData = formatExtraData({ ...firstMsg, ...firmsMsgContent }); // Replaced from proposal.content

  const votingStartTime = _proposal.voting_start_time; // Replaced from proposal.voting_start_time
  const votingEndTime = _proposal.voting_end_time; // Replaced from proposal.voting_end_time
  const paramQuorum = convertNumber(proposalParams.quorum); // Replaced from proposalParams.tally_params.quorum
  const paramMinDepositAmount = convertNumber(proposalParams.minDeposit[0].amount); // Replaced from proposalParams.deposit_params.min_deposit[0].amount
  const periodDeposit = convertNumber(proposalParams.maxDepositPeriod?.seconds.toString()); // Replaced from proposalParams.deposit_params.max_deposit_period

  const proposer = proposal.proposer;

  const tally = {
    yes: convertNumber(tallyRaw.yes_count),
    no: convertNumber(tallyRaw.no_count),
    noWithVeto: convertNumber(tallyRaw.no_with_veto_count),
    abstain: convertNumber(tallyRaw.abstain_count)
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
    proposer
  };
};
