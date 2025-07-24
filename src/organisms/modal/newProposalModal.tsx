import React, { useState, useRef, useEffect, ChangeEvent } from 'react';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import Select from 'react-select';

import useFirma from '../../utils/wallet';
import { convertNumber, convertToFctNumber, getDefaultFee, getFeesFromGas, makeDecimalPoint } from '../../utils/common';
import { rootState } from '../../redux/reducers';
import { Modal } from '../../components/modal';
import { modalActions } from '../../redux/action';
import { GUIDE_LINK_NEW_PROPOSAL } from '../../config';

import { Params as GovParams } from '@kintsugi-tech/cosmjs-types/cosmos/gov/v1/gov';
import { Params as StakingParams } from '@kintsugi-tech/cosmjs-types/cosmos/staking/v1beta1/staking';

import {
  newProposalModalWidth,
  ModalContainer,
  ModalTitle,
  ModalContent,
  ModalLabel,
  ModalInput,
  InputBoxDefault,
  TextAreaDefault,
  NextButton,
  SelectWrapper,
  HelpIcon,
  ButtonWrapper,
  CancelButton,
  ModalInputWrap
} from './styles';
import { FirmaUtil } from '@firmachain/firma-js';

const options = [
  { value: 'TEXT_PROPOSAL', label: 'Text' },
  { value: 'COMMUNITY_POOL_SPEND_PROPOSAL', label: 'CommunityPoolSpend' },
  { value: 'STAKING_PARAMS_UPDATE_PROPOSAL', label: 'StakingParamsUpdate' },
  { value: 'GOV_PARAMS_UPDATE_PROPOSAL', label: 'GovParamsUpdate' },
  { value: 'SOFTWARE_UPGRADE', label: 'SoftwareUpgrade' }
];

const customStyles = {
  control: (provided: any) => ({
    ...provided,
    backgroundColor: '#3d3b48',
    border: '1px solid #ffffff00 !important',
    borderRadius: '0',
    boxShadow: 'none'
  }),
  option: (provided: any) => ({
    ...provided,
    color: '#ccc',
    backgroundColor: '#3d3b48',
    borderRadius: '0',
    paddingTop: '12px',
    paddingBottom: '12px',
    '&:hover': {
      backgroundColor: '#3d3b48'
    }
  }),
  indicatorSeparator: (provided: any) => ({
    ...provided,
    color: '#888',
    backgroundColor: '#888'
  }),
  dropdownIndicator: (provided: any) => ({
    ...provided,
    color: '#888'
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: 'white'
  }),
  menuList: (provided: any) => ({
    ...provided,
    backgroundColor: '#3d3b48',
    borderRadius: '0',
    margin: '0',
    padding: '0'
  })
};

// Parameter object type definition
type ProposalParams = Partial<GovParams & StakingParams>;

const NewProposalModal = () => {
  const newProposalState = useSelector((state: rootState) => state.modal.newProposal);
  const selectInputRef = useRef<any>(null);
  const { enqueueSnackbar } = useSnackbar();
  const { balance } = useSelector((state: rootState) => state.user);
  const { isLedger, isMobileApp } = useSelector((state: rootState) => state.wallet);

  const [proposalType, setProposalType] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [initialDeposit, setInitialDeposit] = useState('');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState(0);
  const [upgradeName, setUpgradeName] = useState('');
  const [height, setHeight] = useState(1);

  // Unified parameter object
  const [paramObj, setParamObj] = useState<ProposalParams>({});

  const {
    FirmaSDK,
    submitCommunityPoolSpendProposal,
    submitTextProposal,
    submitSoftwareUpgrade,
    submitCancelSoftwareUpgrade,
    submitStakingParamsUpdateProposal,
    submitGovParamsUpdateProposal,
    getGasEstimationSubmitCancelSoftwareUpgrade,
    getGasEstimationSubmitCommunityPoolSpendProposal,
    getGasEstimationSubmitSoftwareUpgrade,
    getGasEstimationSubmitTextProposal,
    getGasEstimationSubmitStakingParamsUpdateProposal,
    getGasEstimationSubmitGovParamsUpdateProposal,
    setUserData
  } = useFirma();

  // Parameter update function
  const updateParam = (key: string, value: any) => {
    setParamObj((prev) => ({ ...prev, [key]: value }));
  };

  const closeModal = () => {
    resetModal();
    modalActions.handleModalNewProposal(false);
  };

  const resetModal = () => {
    selectInputRef.current.clearValue();
    setProposalType('');
    resetAllParams();
  };

  const resetAllParams = () => {
    setTitle('');
    setDescription('');
    setInitialDeposit('');
    setRecipient('');
    setAmount(0);
    // setParamList([]);
    // setProposalId('');
    setParamObj({});
  };

  const newProposalTx = (resolveTx: () => void, rejectTx: () => void, gas = 0) => {
    switch (proposalType) {
      case 'TEXT_PROPOSAL':
        submitTextProposal(title, description, Number(initialDeposit), gas)
          .then(() => {
            setUserData();
            resolveTx();
          })
          .catch(() => {
            rejectTx();
          });
        break;
      case 'COMMUNITY_POOL_SPEND_PROPOSAL':
        submitCommunityPoolSpendProposal(title, description, Number(initialDeposit), amount, recipient, gas)
          .then(() => {
            setUserData();
            resolveTx();
          })
          .catch(() => {
            rejectTx();
          });
        break;
      case 'STAKING_PARAMS_UPDATE_PROPOSAL':
        // Convert commission rate to proper decimal format for Cosmos SDK
        const processCommissionRate = (rate: string): string => {
          if (!rate || rate.trim() === '') return '';
          try {
            const rateNum = parseFloat(rate);
            if (isNaN(rateNum) || rateNum < 0 || rateNum > 1) {
              throw new Error(`Invalid commission rate: ${rate}. Must be between 0 and 1`);
            }
            if (rateNum === 0) return '0';
            // Convert to 18-decimal precision integer string
            return FirmaUtil.processCommissionRateAsDecimal(rate);
          } catch (error) {
            console.error('Commission rate conversion error:', error);
            throw error;
          }
        };

        const stakingParams = {
          unbondingTime: {
            seconds: BigInt(paramObj.unbondingTime?.seconds || '0'),
            nanos: paramObj.unbondingTime?.nanos || 0
          },
          maxValidators: paramObj.maxValidators,
          maxEntries: paramObj.maxEntries,
          historicalEntries: paramObj.historicalEntries,
          bondDenom: paramObj.bondDenom,
          minCommissionRate: processCommissionRate(paramObj.minCommissionRate || '')
        };
        const stakingMetadata = '';
        submitStakingParamsUpdateProposal(
          title,
          description,
          Number(initialDeposit),
          stakingParams,
          stakingMetadata,
          gas
        )
          .then(() => {
            setUserData();
            resolveTx();
          })
          .catch(() => {
            rejectTx();
          });
        break;
      case 'GOV_PARAMS_UPDATE_PROPOSAL':
        const govParams = {
          minDeposit: paramObj.minDeposit,
          maxDepositPeriod: {
            seconds: BigInt(paramObj.maxDepositPeriod?.seconds || '0'),
            nanos: paramObj.maxDepositPeriod?.nanos || 0
          },
          votingPeriod: {
            seconds: BigInt(paramObj.votingPeriod?.seconds || '0'),
            nanos: paramObj.votingPeriod?.nanos || 0
          },
          quorum: paramObj.quorum,
          threshold: paramObj.threshold,
          vetoThreshold: paramObj.vetoThreshold,
          minInitialDepositRatio: paramObj.minInitialDepositRatio,
          proposalCancelRatio: paramObj.proposalCancelRatio,
          proposalCancelDest: paramObj.proposalCancelDest,
          expeditedVotingPeriod: {
            seconds: BigInt(paramObj.expeditedVotingPeriod?.seconds || '0'),
            nanos: paramObj.expeditedVotingPeriod?.nanos || 0
          },
          expeditedThreshold: paramObj.expeditedThreshold,
          expeditedMinDeposit: paramObj.expeditedMinDeposit,
          burnVoteQuorum: paramObj.burnVoteQuorum,
          burnProposalDepositPrevote: paramObj.burnProposalDepositPrevote,
          burnVoteVeto: paramObj.burnVoteVeto,
          minDepositRatio: paramObj.minDepositRatio
        };
        const govMetadata = '';
        submitGovParamsUpdateProposal(title, description, Number(initialDeposit), govParams, govMetadata, gas)
          .then(() => {
            setUserData();
            resolveTx();
          })
          .catch(() => {
            rejectTx();
          });
        break;
      case 'SOFTWARE_UPGRADE':
        submitSoftwareUpgrade(title, description, Number(initialDeposit), upgradeName, height, gas)
          .then(() => {
            setUserData();
            resolveTx();
          })
          .catch(() => {
            rejectTx();
          });
        break;
      case 'CANCEL_SOFTWARE_UPGRADE':
        submitCancelSoftwareUpgrade(title, description, Number(initialDeposit), gas)
          .then(() => {
            setUserData();
            resolveTx();
          })
          .catch(() => {
            rejectTx();
          });
        break;
      default:
        break;
    }
  };

  const onChangeType = (e: any) => {
    if (e === null) return;
    setProposalType(e.value);
    resetAllParams();
  };

  const onChangeTitle = (e: any) => {
    if (e === null) return;
    setTitle(e.target.value);
  };

  const onChangeDescription = (e: any) => {
    if (e === null) return;
    setDescription(e.target.value);
  };

  // Helper function to remove leading zeros from number string
  const removeLeadingZeros = (value: string): string => {
    if (value.includes('.')) {
      const [integerPart, decimalPart] = value.split('.');
      const cleanIntegerPart = integerPart.replace(/^0+/, '') || '0';
      return `${cleanIntegerPart}.${decimalPart}`;
    } else {
      return value.replace(/^0+/, '') || '0';
    }
  };

  // Helper function to validate and format decimal places
  const formatDecimalPlaces = (value: string): string => {
    const decimalPattern = /(^\d+$)|(^\d{1,}.\d{0,6}$)/;

    if (!decimalPattern.test(value)) {
      return makeDecimalPoint(convertNumber(value), 6);
    }

    return value;
  };

  // Helper function to enforce maximum amount limit
  const enforceMaxAmount = (value: string): string => {
    const maxAmount = getMaxAmount();
    const currentAmount = convertNumber(value);

    return currentAmount > maxAmount ? maxAmount.toString() : value;
  };

  const onChangeInitialDeposit = (e: ChangeEvent<HTMLInputElement>) => {
    if (e === null) return;

    const inputValue = e.target.value;

    // Basic validation
    if (isNaN(Number(inputValue))) return;
    if (inputValue.startsWith('-')) return;

    // Clean input - keep only numbers and decimal point
    let cleanValue = inputValue.replace(/[^0-9.]/g, '');

    // Handle empty input
    if (cleanValue === '') {
      setInitialDeposit('');
      return;
    }

    // Process the value through formatting steps
    cleanValue = removeLeadingZeros(cleanValue);
    cleanValue = formatDecimalPlaces(cleanValue);
    cleanValue = enforceMaxAmount(cleanValue);

    setInitialDeposit(cleanValue);
  };

  const getMaxAmount = () => {
    const value = convertNumber(
      makeDecimalPoint(convertNumber(balance) - convertToFctNumber(getDefaultFee(isLedger, isMobileApp)), 6)
    );

    return value > 0 ? value : 0;
  };

  const onChangeRecipient = (e: any) => {
    if (e === null) return;
    setRecipient(e.target.value);
  };

  const onChangeAmount = (e: any) => {
    if (e === null) return;
    setAmount(e.target.value);
  };

  const onChangeUpgradeName = (e: any) => {
    if (e === null) return;
    setUpgradeName(e.target.value);
  };

  const onChangeHeight = (e: any) => {
    if (e === null) return;
    setHeight(e.target.value);
  };

  const getParamsTx = () => {
    switch (proposalType) {
      case 'TEXT_PROPOSAL':
        return {
          title,
          description,
          initialDepositFCT: initialDeposit
        };
      case 'COMMUNITY_POOL_SPEND_PROPOSAL':
        return {
          title,
          description,
          initialDepositFCT: initialDeposit,
          fctAmount: amount,
          recipient
        };
      case 'STAKING_PARAMS_UPDATE_PROPOSAL':
        // Commission rate conversion for getParamsTx
        const processCommissionRateParams = (rate: string): string => {
          if (!rate || rate.trim() === '') return '';
          try {
            const rateNum = parseFloat(rate);
            if (isNaN(rateNum) || rateNum < 0 || rateNum > 1) {
              throw new Error(`Invalid commission rate: ${rate}. Must be between 0 and 1`);
            }
            if (rateNum === 0) return '0';
            return Math.floor(rateNum * Math.pow(10, 18)).toString();
          } catch (error) {
            console.error('Commission rate conversion error:', error);
            throw error;
          }
        };

        return {
          title,
          summary: description,
          initialDepositFCT: initialDeposit,
          params: {
            unbondingTime: {
              seconds: String(paramObj.unbondingTime?.seconds) || '0',
              nanos: paramObj.unbondingTime?.nanos || 0
            },
            maxValidators: paramObj.maxValidators,
            maxEntries: paramObj.maxEntries,
            historicalEntries: paramObj.historicalEntries,
            bondDenom: paramObj.bondDenom,
            minCommissionRate: processCommissionRateParams(paramObj.minCommissionRate || '')
          },
          metadata: ''
        };

      case 'GOV_PARAMS_UPDATE_PROPOSAL':
        return {
          title,
          summary: description,
          initialDepositFCT: initialDeposit,
          params: {
            minDeposit: paramObj.minDeposit,
            maxDepositPeriod: {
              seconds: String(paramObj.maxDepositPeriod?.seconds || '0'),
              nanos: paramObj.maxDepositPeriod?.nanos || 0
            },
            votingPeriod: {
              seconds: String(paramObj.votingPeriod?.seconds || '0'),
              nanos: paramObj.votingPeriod?.nanos || 0
            },
            quorum: paramObj.quorum,
            threshold: paramObj.threshold,
            vetoThreshold: paramObj.vetoThreshold,
            minInitialDepositRatio: paramObj.minInitialDepositRatio,
            proposalCancelRatio: paramObj.proposalCancelRatio,
            proposalCancelDest: paramObj.proposalCancelDest,
            expeditedVotingPeriod: {
              seconds: String(paramObj.expeditedVotingPeriod?.seconds || '0'),
              nanos: paramObj.expeditedVotingPeriod?.nanos || 0
            },
            expeditedThreshold: paramObj.expeditedThreshold,
            expeditedMinDeposit: paramObj.expeditedMinDeposit,
            burnVoteQuorum: paramObj.burnVoteQuorum,
            burnProposalDepositPrevote: paramObj.burnProposalDepositPrevote,
            burnVoteVeto: paramObj.burnVoteVeto,
            minDepositRatio: paramObj.minDepositRatio
          },
          metadata: ''
        };

      case 'SOFTWARE_UPGRADE':
        return {
          title,
          summary: description,
          initialDepositFCT: initialDeposit,
          plan: {
            name: title,
            info: description,
            height: String(height),
            time: {
              seconds: String(0),
              nanos: 0
            }
          },
          metadata: ''
        };

      case 'CANCEL_SOFTWARE_UPGRADE':
        return {
          title,
          description,
          initialDepositFCT: initialDeposit
        };
      default:
        return {
          title,
          description,
          initialDepositFCT: initialDeposit
        };
    }
  };

  const getGovModuleName = () => {
    switch (proposalType) {
      case 'TEXT_PROPOSAL':
        return '/submit/text';
      case 'COMMUNITY_POOL_SPEND_PROPOSAL':
        return '/submit/communitypool';
      case 'STAKING_PARAMS_UPDATE_PROPOSAL':
        return '/submit/stakingparamsupdate';
      case 'GOV_PARAMS_UPDATE_PROPOSAL':
        return '/submit/govparamsupdate';
      case 'SOFTWARE_UPGRADE':
        return '/submit/softwareupgrade';
      case 'CANCEL_SOFTWARE_UPGRADE':
        return '/submit/cancelsoftwareupgrade';
      default:
        return '';
    }
  };

  const nextStep = async () => {
    const isCommonInvalid = title === '' || description === '' || Number(initialDeposit) === 0;
    const isCommunityPoolInvalid =
      proposalType === 'COMMUNITY_POOL_SPEND_PROPOSAL' && (recipient === '' || amount === 0);

    // Fix: return false if any of the params are empty.
    // All parameters must always be provided.
    const isStakingParamsInvalid =
      proposalType === 'STAKING_PARAMS_UPDATE_PROPOSAL' &&
      (!paramObj.unbondingTime?.seconds ||
        !paramObj.maxValidators ||
        !paramObj.maxEntries ||
        !paramObj.historicalEntries ||
        !paramObj.bondDenom ||
        !paramObj.minCommissionRate ||
        (!paramObj.minCommissionRate &&
          (parseFloat(paramObj.minCommissionRate) < 0 || parseFloat(paramObj.minCommissionRate) > 1)));

    const isGovParamsInvalid =
      proposalType === 'GOV_PARAMS_UPDATE_PROPOSAL' &&
      (!paramObj.minDeposit?.[0].amount ||
        !paramObj.maxDepositPeriod?.seconds ||
        !paramObj.votingPeriod?.seconds ||
        !paramObj.quorum ||
        !paramObj.threshold ||
        !paramObj.vetoThreshold ||
        !paramObj.minInitialDepositRatio ||
        !paramObj.proposalCancelRatio ||
        !paramObj.expeditedVotingPeriod?.seconds ||
        !paramObj.expeditedThreshold ||
        !paramObj.expeditedMinDeposit?.[0].amount ||
        paramObj.burnVoteQuorum === undefined ||
        paramObj.burnProposalDepositPrevote === undefined ||
        paramObj.burnVoteVeto === undefined ||
        !paramObj.minDepositRatio);

    const isSoftwareUpgradeInvalid = proposalType === 'SOFTWARE_UPGRADE' && (upgradeName === '' || height <= 0);

    if (Number(initialDeposit) === 0) {
      enqueueSnackbar('Insufficient funds. Please check your account balance.', {
        variant: 'error',
        autoHideDuration: 2000
      });

      return;
    }

    if (
      isCommonInvalid ||
      isCommunityPoolInvalid ||
      isStakingParamsInvalid ||
      isGovParamsInvalid ||
      isSoftwareUpgradeInvalid
    ) {
      enqueueSnackbar('Invalid Parameters', {
        variant: 'error',
        autoHideDuration: 2000
      });

      return;
    }

    closeModal();

    let currentGas: number = 0;

    try {
      switch (proposalType) {
        case 'TEXT_PROPOSAL':
          currentGas = await getGasEstimationSubmitTextProposal(title, description, Number(initialDeposit));
          break;
        case 'COMMUNITY_POOL_SPEND_PROPOSAL':
          currentGas = await getGasEstimationSubmitCommunityPoolSpendProposal(
            title,
            description,
            Number(initialDeposit),
            amount,
            recipient
          );
          break;
        case 'STAKING_PARAMS_UPDATE_PROPOSAL':
          // Commission rate conversion helper
          const processCommissionRateEstimate = (rate: string): string => {
            if (!rate || rate.trim() === '') return '';
            try {
              const rateNum = parseFloat(rate);
              if (isNaN(rateNum) || rateNum < 0 || rateNum > 1) {
                throw new Error(`Invalid commission rate: ${rate}. Must be between 0 and 1`);
              }
              if (rateNum === 0) return '0';
              return Math.floor(rateNum * Math.pow(10, 18)).toString();
            } catch (error) {
              console.error('Commission rate conversion error:', error);
              throw error;
            }
          };

          const stakingParamsEstimate = {
            unbondingTime: {
              seconds: BigInt(paramObj.unbondingTime?.seconds || '0'),
              nanos: paramObj.unbondingTime?.nanos || 0
            },
            maxValidators: Number(paramObj.maxValidators),
            maxEntries: Number(paramObj.maxEntries),
            historicalEntries: Number(paramObj.historicalEntries),
            bondDenom: paramObj.bondDenom,
            minCommissionRate: processCommissionRateEstimate(paramObj.minCommissionRate || '')
          };
          const stakingMetadataEstimate = '';
          currentGas = await getGasEstimationSubmitStakingParamsUpdateProposal(
            title,
            description,
            Number(initialDeposit),
            stakingParamsEstimate,
            stakingMetadataEstimate
          );
          break;
        case 'GOV_PARAMS_UPDATE_PROPOSAL':
          const govParamsEstimate = {
            minDeposit: paramObj.minDeposit,
            maxDepositPeriod: {
              seconds: BigInt(paramObj.maxDepositPeriod?.seconds || '0'),
              nanos: paramObj.maxDepositPeriod?.nanos || 0
            },
            votingPeriod: {
              seconds: BigInt(paramObj.votingPeriod?.seconds || '0'),
              nanos: paramObj.votingPeriod?.nanos || 0
            },
            quorum: paramObj.quorum,
            threshold: paramObj.threshold,
            vetoThreshold: paramObj.vetoThreshold,
            minInitialDepositRatio: paramObj.minInitialDepositRatio,
            proposalCancelRatio: paramObj.proposalCancelRatio,
            proposalCancelDest: paramObj.proposalCancelDest,
            expeditedVotingPeriod: {
              seconds: BigInt(paramObj.expeditedVotingPeriod?.seconds || '0'),
              nanos: paramObj.expeditedVotingPeriod?.nanos || 0
            },
            expeditedThreshold: paramObj.expeditedThreshold,
            expeditedMinDeposit: paramObj.expeditedMinDeposit,
            burnVoteQuorum: paramObj.burnVoteQuorum,
            burnProposalDepositPrevote: paramObj.burnProposalDepositPrevote,
            burnVoteVeto: paramObj.burnVoteVeto,
            minDepositRatio: paramObj.minDepositRatio
          };
          const govMetadataEstimate = '';
          currentGas = await getGasEstimationSubmitGovParamsUpdateProposal(
            title,
            description,
            Number(initialDeposit),
            govParamsEstimate,
            govMetadataEstimate
          );
          break;
        case 'SOFTWARE_UPGRADE':
          currentGas = await getGasEstimationSubmitSoftwareUpgrade(
            title,
            description,
            Number(initialDeposit),
            upgradeName,
            height
          );
          break;
        case 'CANCEL_SOFTWARE_UPGRADE':
          currentGas = await getGasEstimationSubmitCancelSoftwareUpgrade(title, description, Number(initialDeposit));
          break;
        default:
          break;
      }
    } catch (error) {
      enqueueSnackbar(error + '', {
        variant: 'error',
        autoHideDuration: 5000
      });
    }

    if (currentGas > 0) {
      if (convertNumber(balance) - Number(initialDeposit) >= convertToFctNumber(getFeesFromGas(currentGas))) {
        modalActions.handleModalData({
          action: 'Proposal',
          module: `/gov${getGovModuleName()}`,
          data: { fees: getFeesFromGas(currentGas), gas: currentGas },
          prevModalAction: modalActions.handleModalNewProposal,
          txAction: newProposalTx,
          txParams: getParamsTx
        });

        modalActions.handleModalConfirmTx(true);
      } else {
        enqueueSnackbar('Insufficient funds. Please check your account balance.', {
          variant: 'error',
          autoHideDuration: 2000
        });
      }
    }
  };

  const getDefaultParams = async () => {
    if (!['STAKING_PARAMS_UPDATE_PROPOSAL', 'GOV_PARAMS_UPDATE_PROPOSAL'].includes(proposalType)) {
      setParamObj({});
      return;
    }

    try {
      if (proposalType === 'STAKING_PARAMS_UPDATE_PROPOSAL') {
        const params = await FirmaSDK.getSDK().Staking.getParamsAsStakingParams();

        setParamObj(params);
      } else if (proposalType === 'GOV_PARAMS_UPDATE_PROPOSAL') {
        const params = await FirmaSDK.getSDK().Gov.getParamAsGovParams();

        setParamObj(params);
      }
    } catch (error) {
      console.error('Failed to fetch default params:', error);
      enqueueSnackbar('Failed to fetch default parameters', {
        variant: 'error',
        autoHideDuration: 2000
      });
    }
  };

  useEffect(() => {
    getDefaultParams();
  }, [proposalType]);

  return (
    <Modal
      visible={newProposalState}
      closable={true}
      visibleClose={false}
      onClose={closeModal}
      width={newProposalModalWidth}
    >
      <ModalContainer style={{ maxHeight: '80vh', overflow: 'hidden' }} data-testid="new-proposal-modal">
        <ModalTitle data-testid="new-proposal-modal-title">
          New Proposal
          <HelpIcon onClick={() => window.open(GUIDE_LINK_NEW_PROPOSAL)} />
        </ModalTitle>
        <ModalContent
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            height: '100%',
            overflow: 'auto'
          }}
        >
          <ModalInputWrap>
            <ModalLabel>Type</ModalLabel>
            <ModalInput>
              <SelectWrapper data-testid="proposal-type-select-wrapper">
                <Select
                  options={options}
                  styles={customStyles}
                  onChange={onChangeType}
                  ref={selectInputRef}
                  data-testid="proposal-type-select"
                />
              </SelectWrapper>
            </ModalInput>
          </ModalInputWrap>

          <ModalInputWrap>
            <ModalLabel>Title</ModalLabel>
            <ModalInput>
              <InputBoxDefault
                type="text"
                placeholder="Proposal Title"
                value={title}
                onChange={onChangeTitle}
                data-testid="proposal-title-input"
              />
            </ModalInput>
          </ModalInputWrap>

          <ModalInputWrap>
            <ModalLabel>Description</ModalLabel>
            <ModalInput>
              <TextAreaDefault
                value={description}
                placeholder="Proposal Description"
                onChange={onChangeDescription}
                data-testid="proposal-description-textarea"
              />
            </ModalInput>
          </ModalInputWrap>
          <ModalInputWrap>
            <ModalLabel>Initial Deposit</ModalLabel>
            <ModalInput>
              <InputBoxDefault
                type="text"
                placeholder="0"
                value={initialDeposit}
                onChange={onChangeInitialDeposit}
                data-testid="proposal-initial-deposit-input"
              />
            </ModalInput>
          </ModalInputWrap>
          {/* CommunityPool */}
          {proposalType === 'COMMUNITY_POOL_SPEND_PROPOSAL' && (
            <>
              <ModalInputWrap>
                <ModalLabel>Recipient</ModalLabel>
                <ModalInput>
                  <InputBoxDefault
                    type="text"
                    placeholder="Enter Recipient Address"
                    value={recipient}
                    onChange={onChangeRecipient}
                    data-testid="proposal-recipient-input"
                  />
                </ModalInput>
              </ModalInputWrap>
              <ModalInputWrap>
                <ModalLabel>Amount</ModalLabel>
                <ModalInput>
                  <InputBoxDefault
                    type="number"
                    placeholder=""
                    value={amount}
                    onChange={onChangeAmount}
                    data-testid="proposal-amount-input"
                  />
                </ModalInput>
              </ModalInputWrap>
            </>
          )}

          {/* Software Upgrade */}
          {proposalType === 'SOFTWARE_UPGRADE' && (
            <>
              <ModalInputWrap>
                <ModalLabel>Upgrade Name</ModalLabel>
                <ModalInput>
                  <InputBoxDefault
                    type="text"
                    placeholder="v0.1.0"
                    value={upgradeName}
                    onChange={onChangeUpgradeName}
                    data-testid="proposal-upgrade-name-input"
                  />
                </ModalInput>
              </ModalInputWrap>
              <ModalInputWrap>
                <ModalLabel>Height</ModalLabel>
                <ModalInput>
                  <InputBoxDefault
                    type="number"
                    placeholder="1"
                    value={height}
                    onChange={onChangeHeight}
                    data-testid="proposal-height-input"
                  />
                </ModalInput>
              </ModalInputWrap>
            </>
          )}

          {/* Staking Parameters */}
          {proposalType === 'STAKING_PARAMS_UPDATE_PROPOSAL' && (
            <>
              <ModalInputWrap>
                <ModalLabel>Unbonding Time (seconds)</ModalLabel>
                <ModalInput>
                  <InputBoxDefault
                    type="number"
                    placeholder="1814400"
                    value={paramObj.unbondingTime?.seconds.toString() || ''}
                    onChange={(e) =>
                      updateParam('unbondingTime', {
                        seconds: e.target.value,
                        nanos: paramObj.unbondingTime?.nanos || 0
                      })
                    }
                    decimal={0}
                  />
                </ModalInput>
              </ModalInputWrap>
              <ModalInputWrap>
                <ModalLabel>Max Validators</ModalLabel>
                <ModalInput>
                  <InputBoxDefault
                    type="number"
                    placeholder="100"
                    value={paramObj.maxValidators?.toString() || ''}
                    onChange={(e) => updateParam('maxValidators', e.target.value)}
                    decimal={0}
                  />
                </ModalInput>
              </ModalInputWrap>
              <ModalInputWrap>
                <ModalLabel>Max Entries</ModalLabel>
                <ModalInput>
                  <InputBoxDefault
                    type="number"
                    placeholder="7"
                    value={paramObj.maxEntries?.toString() || ''}
                    onChange={(e) => updateParam('maxEntries', e.target.value)}
                    decimal={0}
                  />
                </ModalInput>
              </ModalInputWrap>
              <ModalInputWrap>
                <ModalLabel>Historical Entries</ModalLabel>
                <ModalInput>
                  <InputBoxDefault
                    type="number"
                    placeholder="10000"
                    value={paramObj.historicalEntries?.toString() || ''}
                    onChange={(e) => updateParam('historicalEntries', e.target.value)}
                    decimal={0}
                  />
                </ModalInput>
              </ModalInputWrap>
              <ModalInputWrap>
                <ModalLabel>Bond Denom</ModalLabel>
                <ModalInput>
                  <InputBoxDefault
                    type="text"
                    placeholder="ufct"
                    value={paramObj.bondDenom || ''}
                    onChange={(e) => updateParam('bondDenom', e.target.value)}
                  />
                </ModalInput>
              </ModalInputWrap>
              <ModalInputWrap>
                <ModalLabel>Min Commission Rate (decimal)</ModalLabel>
                <ModalInput>
                  <InputBoxDefault
                    type="number"
                    placeholder="0.05"
                    value={paramObj.minCommissionRate || ''}
                    onChange={(e) => updateParam('minCommissionRate', e.target.value)}
                    decimal={18}
                  />
                  <div style={{ fontSize: '11px', color: '#888', marginTop: '5px' }}>
                    Enter as decimal (e.g., 0.05 for 5%). Range: 0.0 to 1.0
                  </div>
                </ModalInput>
              </ModalInputWrap>
            </>
          )}

          {/* Cancel Software Upgrade */}
          {proposalType === 'CANCEL_SOFTWARE_UPGRADE' && (
            <ModalInputWrap>
              <div
                style={{
                  padding: '15px',
                  background: '#2a2a2a',
                  border: '1px solid #4a90e2',
                  borderRadius: '4px',
                  marginBottom: '15px'
                }}
              >
                <p style={{ color: '#4a90e2', marginBottom: '10px', fontSize: '14px' }}>
                  <strong>Cancel Software Upgrade Proposal</strong>
                </p>
                <p style={{ color: '#ccc', fontSize: '12px', margin: '0' }}>
                  This proposal will cancel any pending software upgrade that has been scheduled but not yet executed.
                  Use this when you need to halt a previously approved upgrade proposal.
                </p>
              </div>
            </ModalInputWrap>
          )}
          {/* Governance Parameters */}
          {proposalType === 'GOV_PARAMS_UPDATE_PROPOSAL' && (
            <>
              <ModalInputWrap>
                <ModalLabel>Min Deposit (ufct)</ModalLabel>
                <ModalInput>
                  <InputBoxDefault
                    type="number"
                    placeholder="5000000000"
                    value={paramObj.minDeposit?.[0]?.amount || ''}
                    onChange={(e) => updateParam('minDeposit', [{ denom: 'ufct', amount: e.target.value }])}
                    decimal={0}
                  />
                </ModalInput>
              </ModalInputWrap>
              <ModalInputWrap>
                <ModalLabel>Max Deposit Period (seconds)</ModalLabel>
                <ModalInput>
                  <InputBoxDefault
                    type="number"
                    placeholder="172800"
                    value={paramObj.maxDepositPeriod?.seconds?.toString() || ''}
                    onChange={(e) =>
                      updateParam('maxDepositPeriod', {
                        seconds: e.target.value,
                        nanos: paramObj.maxDepositPeriod?.nanos || 0
                      })
                    }
                    decimal={0}
                  />
                </ModalInput>
              </ModalInputWrap>
              <ModalInputWrap>
                <ModalLabel>Voting Period (seconds)</ModalLabel>
                <ModalInput>
                  <InputBoxDefault
                    type="number"
                    placeholder="172800"
                    value={paramObj.votingPeriod?.seconds?.toString() || ''}
                    onChange={(e) =>
                      updateParam('votingPeriod', {
                        seconds: e.target.value,
                        nanos: paramObj.votingPeriod?.nanos || 0
                      })
                    }
                    decimal={0}
                  />
                </ModalInput>
              </ModalInputWrap>
              <ModalInputWrap>
                <ModalLabel>Quorum (decimal)</ModalLabel>
                <ModalInput>
                  <InputBoxDefault
                    type="number"
                    placeholder="0.334000000000000000"
                    value={paramObj.quorum || ''}
                    onChange={(e) => updateParam('quorum', e.target.value)}
                    decimal={18}
                  />
                </ModalInput>
              </ModalInputWrap>
              <ModalInputWrap>
                <ModalLabel>Threshold (decimal)</ModalLabel>
                <ModalInput>
                  <InputBoxDefault
                    type="number"
                    placeholder="0.500000000000000000"
                    value={paramObj.threshold || ''}
                    onChange={(e) => updateParam('threshold', e.target.value)}
                    decimal={18}
                  />
                </ModalInput>
              </ModalInputWrap>
              <ModalInputWrap>
                <ModalLabel>Veto Threshold (decimal)</ModalLabel>
                <ModalInput>
                  <InputBoxDefault
                    type="number"
                    placeholder="0.334000000000000000"
                    value={paramObj.vetoThreshold || ''}
                    onChange={(e) => updateParam('vetoThreshold', e.target.value)}
                    decimal={18}
                  />
                </ModalInput>
              </ModalInputWrap>
              <ModalInputWrap>
                <ModalLabel>Min Initial Deposit Ratio (decimal)</ModalLabel>
                <ModalInput>
                  <InputBoxDefault
                    type="number"
                    placeholder="0.100000000000000000"
                    value={paramObj.minInitialDepositRatio || ''}
                    onChange={(e) => updateParam('minInitialDepositRatio', e.target.value)}
                    decimal={18}
                  />
                </ModalInput>
              </ModalInputWrap>
              <ModalInputWrap>
                <ModalLabel>Proposal Cancel Ratio (decimal)</ModalLabel>
                <ModalInput>
                  <InputBoxDefault
                    type="number"
                    placeholder="0.500000000000000000"
                    value={paramObj.proposalCancelRatio || ''}
                    onChange={(e) => updateParam('proposalCancelRatio', e.target.value)}
                    decimal={18}
                  />
                </ModalInput>
              </ModalInputWrap>
              <ModalInputWrap>
                <ModalLabel>Proposal Cancel Destination (optional)</ModalLabel>
                <ModalInput>
                  <InputBoxDefault
                    type="text"
                    placeholder="community pool or address"
                    value={paramObj.proposalCancelDest || ''}
                    onChange={(e) => updateParam('proposalCancelDest', e.target.value)}
                  />
                </ModalInput>
              </ModalInputWrap>
              <ModalInputWrap>
                <ModalLabel>Expedited Voting Period (seconds)</ModalLabel>
                <ModalInput>
                  <InputBoxDefault
                    type="number"
                    placeholder="86400"
                    value={
                      paramObj.expeditedVotingPeriod?.seconds ? String(paramObj.expeditedVotingPeriod.seconds) : ''
                    }
                    onChange={(e) =>
                      updateParam('expeditedVotingPeriod', {
                        seconds: e.target.value,
                        nanos: paramObj.expeditedVotingPeriod?.nanos || 0
                      })
                    }
                    decimal={0}
                  />
                </ModalInput>
              </ModalInputWrap>
              <ModalInputWrap>
                <ModalLabel>Expedited Threshold (decimal)</ModalLabel>
                <ModalInput>
                  <InputBoxDefault
                    type="number"
                    placeholder="0.667000000000000000"
                    value={paramObj.expeditedThreshold || ''}
                    onChange={(e) => updateParam('expeditedThreshold', e.target.value)}
                    decimal={18}
                  />
                </ModalInput>
              </ModalInputWrap>
              <ModalInputWrap>
                <ModalLabel>Expedited Min Deposit (ufct)</ModalLabel>
                <ModalInput>
                  <InputBoxDefault
                    type="number"
                    placeholder="10000000000"
                    value={paramObj.expeditedMinDeposit?.[0]?.amount || ''}
                    onChange={(e) => updateParam('expeditedMinDeposit', [{ denom: 'ufct', amount: e.target.value }])}
                    decimal={0}
                  />
                </ModalInput>
              </ModalInputWrap>
              <ModalInputWrap>
                <ModalLabel>Burn Vote Quorum</ModalLabel>
                <ModalInput>
                  <label style={{ display: 'flex', alignItems: 'center', color: '#ccc' }}>
                    <input
                      type="checkbox"
                      checked={paramObj.burnVoteQuorum || false}
                      onChange={(e) => updateParam('burnVoteQuorum', e.target.checked)}
                      style={{ marginRight: '8px' }}
                    />
                    Burn deposits when proposal doesn't meet quorum
                  </label>
                </ModalInput>
              </ModalInputWrap>
              <ModalInputWrap>
                <ModalLabel>Burn Proposal Deposit Prevote</ModalLabel>
                <ModalInput>
                  <label style={{ display: 'flex', alignItems: 'center', color: '#ccc' }}>
                    <input
                      type="checkbox"
                      checked={paramObj.burnProposalDepositPrevote || false}
                      onChange={(e) => updateParam('burnProposalDepositPrevote', e.target.checked)}
                      style={{ marginRight: '8px' }}
                    />
                    Burn deposits if proposal fails in prevote phase
                  </label>
                </ModalInput>
              </ModalInputWrap>
              <ModalInputWrap>
                <ModalLabel>Burn Vote Veto</ModalLabel>
                <ModalInput>
                  <label style={{ display: 'flex', alignItems: 'center', color: '#ccc' }}>
                    <input
                      type="checkbox"
                      checked={paramObj.burnVoteVeto !== false}
                      onChange={(e) => updateParam('burnVoteVeto', e.target.checked)}
                      style={{ marginRight: '8px' }}
                    />
                    Burn deposits when proposal is vetoed
                  </label>
                </ModalInput>
              </ModalInputWrap>
              <ModalInputWrap>
                <ModalLabel>Min Deposit Ratio (decimal)</ModalLabel>
                <ModalInput>
                  <InputBoxDefault
                    type="number"
                    placeholder="0.010000000000000000"
                    value={paramObj.minDepositRatio || ''}
                    onChange={(e) => updateParam('minDepositRatio', e.target.value)}
                    decimal={18}
                  />
                </ModalInput>
              </ModalInputWrap>
            </>
          )}

          <ButtonWrapper>
            <CancelButton onClick={() => closeModal()} status={1} data-testid="proposal-cancel-button">
              Cancel
            </CancelButton>
            <NextButton
              onClick={() => {
                if (proposalType) nextStep();
              }}
              status={proposalType !== '' ? 0 : 2}
              data-testid="proposal-next-button"
            >
              Next
            </NextButton>
          </ButtonWrapper>
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
};

export default React.memo(NewProposalModal);
