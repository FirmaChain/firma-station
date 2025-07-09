import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import Select from 'react-select';

import useFirma from '../../utils/wallet';
import { convertNumber, convertToFctNumber, getDefaultFee, getFeesFromGas, makeDecimalPoint } from '../../utils/common';
import { rootState } from '../../redux/reducers';
import { Modal } from '../../components/modal';
import { modalActions } from '../../redux/action';
import { GUIDE_LINK_NEW_PROPOSAL } from '../../config';

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
  ParamTable,
  ParamHeader,
  ParamBody,
  Param,
  AddButton,
  DeleteButton,
  HelpIcon,
  ButtonWrapper,
  CancelButton,
  ModalInputWrap,
} from './styles';

  const options = [
    { value: 'TEXT_PROPOSAL', label: 'Text' },
    { value: 'COMMUNITY_POOL_SPEND_PROPOSAL', label: 'CommunityPoolSpend' },
    // { value: 'PARAMETER_CHANGE_PROPOSAL', label: 'ParameterChange' },
    { value: 'STAKING_PARAMS_UPDATE_PROPOSAL', label: 'StakingParamsUpdate' },
    { value: 'GOV_PARAMS_UPDATE_PROPOSAL', label: 'GovParamsUpdate' },
    { value: 'SOFTWARE_UPGRADE', label: 'SoftwareUpgrade' },
    // { value: 'CANCEL_SOFTWARE_UPGRADE', label: 'CancelSoftwareUpgrade' },
    { value: 'CANCEL_PROPOSAL', label: 'CancelProposal' },
  ];

const customStyles = {
  control: (provided: any) => ({
    ...provided,
    backgroundColor: '#3d3b48',
    border: '1px solid #ffffff00 !important',
    borderRadius: '0',
    boxShadow: 'none',
  }),
  option: (provided: any) => ({
    ...provided,
    color: '#ccc',
    backgroundColor: '#3d3b48',
    borderRadius: '0',
    paddingTop: '12px',
    paddingBottom: '12px',
    '&:hover': {
      backgroundColor: '#3d3b48',
    },
  }),
  indicatorSeparator: (provided: any) => ({
    ...provided,
    color: '#888',
    backgroundColor: '#888',
  }),
  dropdownIndicator: (provided: any) => ({
    ...provided,
    color: '#888',
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: 'white',
  }),
  menuList: (provided: any) => ({
    ...provided,
    backgroundColor: '#3d3b48',
    borderRadius: '0',
    margin: '0',
    padding: '0',
  }),
};

const NewProposalModal = () => {
  const newProposalState = useSelector((state: rootState) => state.modal.newProposal);
  const selectInputRef = useRef<any>(null);
  const { enqueueSnackbar } = useSnackbar();
  const { balance } = useSelector((state: rootState) => state.user);
  const { isLedger, isMobileApp } = useSelector((state: rootState) => state.wallet);

  const [proposalType, setProposalType] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [initialDeposit, setInitialDeposit] = useState(0);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState(0);
  const [upgradeName, setUpgradeName] = useState('');
  const [height, setHeight] = useState(1);
  const [paramList, setParamList] = useState<any[]>([]);
  const [proposalId, setProposalId] = useState('');

  // Staking Parameters
  const [stakingUnbondingTime, setStakingUnbondingTime] = useState('1814400s'); // 21 days default
  const [stakingMaxValidators, setStakingMaxValidators] = useState(100);
  const [stakingMaxEntries, setStakingMaxEntries] = useState(7);
  const [stakingHistoricalEntries, setStakingHistoricalEntries] = useState(10000);
  const [stakingBondDenom, setStakingBondDenom] = useState('ufct');
  const [stakingMinCommissionRate, setStakingMinCommissionRate] = useState('0.05');

  // Gov Parameters  
  const [govMinDeposit, setGovMinDeposit] = useState('5000000000');
  const [govMaxDepositPeriod, setGovMaxDepositPeriod] = useState('172800s'); // 2 days
  const [govVotingPeriod, setGovVotingPeriod] = useState('172800s'); // 2 days
  const [govQuorum, setGovQuorum] = useState('0.334000000000000000');
  const [govThreshold, setGovThreshold] = useState('0.500000000000000000');
  const [govVetoThreshold, setGovVetoThreshold] = useState('0.334000000000000000');
  const [govMinInitialDepositRatio, setGovMinInitialDepositRatio] = useState('0.100000000000000000');
  const [govProposalCancelRatio, setGovProposalCancelRatio] = useState('0.500000000000000000');
  const [govProposalCancelDest, setGovProposalCancelDest] = useState('');
  const [govExpeditedVotingPeriod, setGovExpeditedVotingPeriod] = useState('86400s'); // 1 day
  const [govExpeditedThreshold, setGovExpeditedThreshold] = useState('0.667000000000000000');
  const [govExpeditedMinDeposit, setGovExpeditedMinDeposit] = useState('10000000000');
  const [govBurnVoteQuorum, setGovBurnVoteQuorum] = useState(false);
  const [govBurnProposalDepositPrevote, setGovBurnProposalDepositPrevote] = useState(false);
  const [govBurnVoteVeto, setGovBurnVoteVeto] = useState(true);
  const [govMinDepositRatio, setGovMinDepositRatio] = useState('0.010000000000000000');

  const {
    submitParameterChangeProposal,
    submitCommunityPoolSpendProposal,
    submitTextProposal,
    submitSoftwareUpgrade,
    submitCancelSoftwareUpgrade,
    submitStakingParamsUpdateProposal,
    submitGovParamsUpdateProposal,
    cancelProposal,
    getGasEstimationSubmitCancelSoftwareUpgrade,
    getGasEstimationSubmitParameterChangeProposal,
    getGasEstimationSubmitCommunityPoolSpendProposal,
    getGasEstimationSubmitSoftwareUpgrade,
    getGasEstimationSubmitTextProposal,
    getGasEstimationSubmitStakingParamsUpdateProposal,
    getGasEstimationSubmitGovParamsUpdateProposal,
    getGasEstimationCancelProposal,
    setUserData,
  } = useFirma();

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
    setInitialDeposit(0);
    setRecipient('');
        setAmount(0);
    setParamList([]);
    setProposalId('');
    
    // Reset Staking Parameters to defaults
    setStakingUnbondingTime('1814400s');
    setStakingMaxValidators(100);
    setStakingMaxEntries(7);
    setStakingHistoricalEntries(10000);
    setStakingBondDenom('ufct');
    setStakingMinCommissionRate('0.05');

    // Reset Gov Parameters to defaults
    setGovMinDeposit('5000000000');
    setGovMaxDepositPeriod('172800s');
    setGovVotingPeriod('172800s');
    setGovQuorum('0.334000000000000000');
    setGovThreshold('0.500000000000000000');
    setGovVetoThreshold('0.334000000000000000');
    setGovMinInitialDepositRatio('0.100000000000000000');
    setGovProposalCancelRatio('0.500000000000000000');
    setGovProposalCancelDest('');
    setGovExpeditedVotingPeriod('86400s');
    setGovExpeditedThreshold('0.667000000000000000');
    setGovExpeditedMinDeposit('10000000000');
    setGovBurnVoteQuorum(false);
    setGovBurnProposalDepositPrevote(false);
    setGovBurnVoteVeto(true);
    setGovMinDepositRatio('0.010000000000000000');
  };

  const newProposalTx = (resolveTx: () => void, rejectTx: () => void, gas = 0) => {
    switch (proposalType) {
      case 'TEXT_PROPOSAL':
        submitTextProposal(title, description, initialDeposit, gas)
          .then(() => {
            setUserData();
            resolveTx();
          })
          .catch(() => {
            rejectTx();
          });
        break;
      case 'COMMUNITY_POOL_SPEND_PROPOSAL':
        submitCommunityPoolSpendProposal(title, description, initialDeposit, amount, recipient, gas)
          .then(() => {
            setUserData();
            resolveTx();
          })
          .catch(() => {
            rejectTx();
          });
        break;
      case 'PARAMETER_CHANGE_PROPOSAL':
        const validParamList = paramList.filter(
          (value: any) => value.subspace !== '' && value.key !== '' && value.value !== ''
        );
        submitParameterChangeProposal(title, description, initialDeposit, validParamList, gas)
          .then(() => {
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
            // Convert to 18-decimal precision integer string (multiply by 10^18)
            const atomics = Math.floor(rateNum * Math.pow(10, 18)).toString();
            return atomics;
          } catch (error) {
            console.error('Commission rate conversion error:', error);
            throw error;
          }
        };

        const stakingParams = {
          unbondingTime: { seconds: BigInt(stakingUnbondingTime.replace('s', '')), nanos: 0 },
          maxValidators: stakingMaxValidators,
          maxEntries: stakingMaxEntries,
          historicalEntries: stakingHistoricalEntries,
          bondDenom: stakingBondDenom,
          minCommissionRate: processCommissionRate(stakingMinCommissionRate)
        };
        const stakingMetadata = '';
        submitStakingParamsUpdateProposal(title, description, initialDeposit, stakingParams, stakingMetadata, gas)
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
          minDeposit: [{ denom: 'ufct', amount: govMinDeposit }],
          maxDepositPeriod: { seconds: BigInt(govMaxDepositPeriod.replace('s', '')), nanos: 0 },
          votingPeriod: { seconds: BigInt(govVotingPeriod.replace('s', '')), nanos: 0 },
          quorum: govQuorum,
          threshold: govThreshold,
          vetoThreshold: govVetoThreshold,
          minInitialDepositRatio: govMinInitialDepositRatio,
          proposalCancelRatio: govProposalCancelRatio,
          proposalCancelDest: govProposalCancelDest,
          expeditedVotingPeriod: { seconds: BigInt(govExpeditedVotingPeriod.replace('s', '')), nanos: 0 },
          expeditedThreshold: govExpeditedThreshold,
          expeditedMinDeposit: [{ denom: 'ufct', amount: govExpeditedMinDeposit }],
          burnVoteQuorum: govBurnVoteQuorum,
          burnProposalDepositPrevote: govBurnProposalDepositPrevote,
          burnVoteVeto: govBurnVoteVeto,
          minDepositRatio: govMinDepositRatio
        };
        const govMetadata = '';
        submitGovParamsUpdateProposal(title, description, initialDeposit, govParams, govMetadata, gas)
          .then(() => {
            setUserData();
            resolveTx();
          })
          .catch(() => {
            rejectTx();
          });
        break;
      case 'SOFTWARE_UPGRADE':
        submitSoftwareUpgrade(title, description, initialDeposit, upgradeName, height, gas)
          .then(() => {
            setUserData();
            resolveTx();
          })
          .catch(() => {
            rejectTx();
          });
        break;
      case 'CANCEL_SOFTWARE_UPGRADE':
        submitCancelSoftwareUpgrade(title, description, initialDeposit, gas)
          .then(() => {
            setUserData();
            resolveTx();
          })
          .catch(() => {
            rejectTx();
          });
        break;
      case 'CANCEL_PROPOSAL':
        cancelProposal(proposalId, gas)
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

  const onChangeInitialDeposit = (e: any) => {
    if (e === null) return;
    const { value } = e.target;

    let amount: string = value.replace(/[^0-9.]/g, '');

    if (amount === '') {
      setInitialDeposit(0);
      return;
    }

    const pattern = /(^\d+$)|(^\d{1,}.\d{0,6}$)/;

    if (!pattern.test(amount)) {
      amount = makeDecimalPoint(convertNumber(amount), 6);
    }

    if (convertNumber(amount) > getMaxAmount()) {
      amount = getMaxAmount().toString();
    }

    setInitialDeposit(convertNumber(amount));
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

  const onChangeSubspace = (e: any, index: number) => {
    setParamList((prevState) => [
      ...prevState.map((item, i) => (i === index ? { ...item, subspace: e.target.value } : item)),
    ]);
  };
  const onChangeKey = (e: any, index: number) => {
    setParamList((prevState) => [
      ...prevState.map((item, i) => (i === index ? { ...item, key: e.target.value } : item)),
    ]);
  };
  const onChangeValue = (e: any, index: number) => {
    setParamList((prevState) => [
      ...prevState.map((item, i) => (i === index ? { ...item, value: e.target.value } : item)),
    ]);
  };

  const addParam = () => {
    setParamList((prevState) => [...prevState, { subspace: '', key: '', value: '' }]);
  };

  const deleteParam = (index: number) => {
    setParamList((prevState) => [...prevState.filter((v, i) => i !== index)]);
  };

  const getParamsTx = () => {
    switch (proposalType) {
      case 'TEXT_PROPOSAL':
        return {
          title,
          description,
          initialDepositFCT: initialDeposit,
        };
      case 'COMMUNITY_POOL_SPEND_PROPOSAL':
        return {
          title,
          description,
          initialDepositFCT: initialDeposit,
          fctAmount: amount,
          recipient,
        };
      case 'PARAMETER_CHANGE_PROPOSAL':
        return {
          title,
          description,
          initialDepositFCT: initialDeposit,
          paramList: paramList.filter((value: any) => value.subspace !== '' && value.key !== '' && value.value !== ''),
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
          stakingParams: {
            unbondingTime: { seconds: BigInt(stakingUnbondingTime.replace('s', '')), nanos: 0 },
            maxValidators: stakingMaxValidators,
            maxEntries: stakingMaxEntries,
            historicalEntries: stakingHistoricalEntries,
            bondDenom: stakingBondDenom,
            minCommissionRate: processCommissionRateParams(stakingMinCommissionRate)
          },
          metadata: '',
        };
      case 'GOV_PARAMS_UPDATE_PROPOSAL':
        return {
          title,
          summary: description,
          initialDepositFCT: initialDeposit,
          govParams: {
            minDeposit: [{ denom: 'ufct', amount: govMinDeposit }],
            maxDepositPeriod: { seconds: BigInt(govMaxDepositPeriod.replace('s', '')), nanos: 0 },
            votingPeriod: { seconds: BigInt(govVotingPeriod.replace('s', '')), nanos: 0 },
            quorum: govQuorum,
            threshold: govThreshold,
            vetoThreshold: govVetoThreshold,
            minInitialDepositRatio: govMinInitialDepositRatio,
            proposalCancelRatio: govProposalCancelRatio,
            proposalCancelDest: govProposalCancelDest,
            expeditedVotingPeriod: { seconds: BigInt(govExpeditedVotingPeriod.replace('s', '')), nanos: 0 },
            expeditedThreshold: govExpeditedThreshold,
            expeditedMinDeposit: [{ denom: 'ufct', amount: govExpeditedMinDeposit }],
            burnVoteQuorum: govBurnVoteQuorum,
            burnProposalDepositPrevote: govBurnProposalDepositPrevote,
            burnVoteVeto: govBurnVoteVeto,
            minDepositRatio: govMinDepositRatio
          },
          metadata: '',
        };
      case 'SOFTWARE_UPGRADE':
        return {
          title,
          description,
          initialDepositFCT: initialDeposit,
          upgradeName,
          upgradeHeight: height,
        };
      case 'CANCEL_SOFTWARE_UPGRADE':
        return {
          title,
          description,
          initialDepositFCT: initialDeposit,
        };
      case 'CANCEL_PROPOSAL':
        return {
          title,
          description,
          initialDepositFCT: initialDeposit,
          proposalId: parseInt(proposalId),
        };
      default:
        return {
          title,
          description,
          initialDepositFCT: initialDeposit,
        };
    }
  };

  const getGovModuleName = () => {
    switch (proposalType) {
      case 'TEXT_PROPOSAL':
        return '/submit/text';
      case 'COMMUNITY_POOL_SPEND_PROPOSAL':
        return '/submit/communitypool';
      case 'PARAMETER_CHANGE_PROPOSAL':
        return '/submit/paramchange';
      case 'STAKING_PARAMS_UPDATE_PROPOSAL':
        return '/submit/stakingparamsupdate';
      case 'GOV_PARAMS_UPDATE_PROPOSAL':
        return '/submit/govparamsupdate';
      case 'SOFTWARE_UPGRADE':
        return '/submit/softwareupgrade';
      case 'CANCEL_SOFTWARE_UPGRADE':
        return '/submit/cancelsoftwareupgrade';
      case 'CANCEL_PROPOSAL':
        return '/submit/cancelproposal';
      default:
        return '';
    }
  };

  const nextStep = async () => {
    const validParamList = paramList.filter(
      (value: any) => value.subspace !== '' && value.key !== '' && value.value !== ''
    );

    const isCommonInvalid = title === '' || description === '' || initialDeposit === 0;
    const isCommunityPoolInvalid =
      proposalType === 'COMMUNITY_POOL_SPEND_PROPOSAL' && (recipient === '' || amount === 0);
    const isParameterChangeInvalid = proposalType === 'PARAMETER_CHANGE_PROPOSAL' && validParamList.length === 0;
    const isStakingParamsInvalid = proposalType === 'STAKING_PARAMS_UPDATE_PROPOSAL' &&
      (stakingUnbondingTime === '' || stakingMaxValidators <= 0 || stakingMaxEntries <= 0 ||
        stakingHistoricalEntries < 0 || stakingBondDenom === '' ||
        stakingMinCommissionRate === '' ||
        (stakingMinCommissionRate !== '' && (parseFloat(stakingMinCommissionRate) < 0 || parseFloat(stakingMinCommissionRate) > 1)));
    const isGovParamsInvalid = proposalType === 'GOV_PARAMS_UPDATE_PROPOSAL' &&
      (govMinDeposit === '' || govMaxDepositPeriod === '' || govVotingPeriod === '' ||
        govQuorum === '' || govThreshold === '' || govVetoThreshold === '');
    const isSoftwareUpgradeInvalid = proposalType === 'SOFTWARE_UPGRADE' && (upgradeName === '' || height <= 0);
    const isCancelProposalInvalid = proposalType === 'CANCEL_PROPOSAL' && (proposalId === '' || isNaN(parseInt(proposalId)));

    if (initialDeposit === 0) {
      enqueueSnackbar('Insufficient funds. Please check your account balance.', {
        variant: 'error',
        autoHideDuration: 2000,
      });

      return;
    }

    if (isCommonInvalid || isCommunityPoolInvalid || isParameterChangeInvalid || isStakingParamsInvalid || isGovParamsInvalid || isSoftwareUpgradeInvalid || isCancelProposalInvalid) {
      enqueueSnackbar('Invalid Parameters', {
        variant: 'error',
        autoHideDuration: 2000,
      });

      return;
    }

    closeModal();

    let currentGas: number = 0;

    try {
      switch (proposalType) {
        case 'TEXT_PROPOSAL':
          currentGas = await getGasEstimationSubmitTextProposal(title, description, initialDeposit);
          break;
        case 'COMMUNITY_POOL_SPEND_PROPOSAL':
          currentGas = await getGasEstimationSubmitCommunityPoolSpendProposal(
            title,
            description,
            initialDeposit,
            amount,
            recipient
          );
          break;
        case 'PARAMETER_CHANGE_PROPOSAL':
          const validParamList = paramList.filter(
            (value: any) => value.subspace !== '' && value.key !== '' && value.value !== ''
          );
          currentGas = await getGasEstimationSubmitParameterChangeProposal(
            title,
            description,
            initialDeposit,
            validParamList
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
            unbondingTime: { seconds: BigInt(stakingUnbondingTime.replace('s', '')), nanos: 0 },
            maxValidators: stakingMaxValidators,
            maxEntries: stakingMaxEntries,
            historicalEntries: stakingHistoricalEntries,
            bondDenom: stakingBondDenom,
            minCommissionRate: processCommissionRateEstimate(stakingMinCommissionRate)
          };
          const stakingMetadataEstimate = '';
          currentGas = await getGasEstimationSubmitStakingParamsUpdateProposal(
            title,
            description,
            initialDeposit,
            stakingParamsEstimate,
            stakingMetadataEstimate
          );
          break;
        case 'GOV_PARAMS_UPDATE_PROPOSAL':
          const govParamsEstimate = {
            minDeposit: [{ denom: 'ufct', amount: govMinDeposit }],
            maxDepositPeriod: { seconds: BigInt(govMaxDepositPeriod.replace('s', '')), nanos: 0 },
            votingPeriod: { seconds: BigInt(govVotingPeriod.replace('s', '')), nanos: 0 },
            quorum: govQuorum,
            threshold: govThreshold,
            vetoThreshold: govVetoThreshold,
            minInitialDepositRatio: govMinInitialDepositRatio,
            proposalCancelRatio: govProposalCancelRatio,
            proposalCancelDest: govProposalCancelDest,
            expeditedVotingPeriod: { seconds: BigInt(govExpeditedVotingPeriod.replace('s', '')), nanos: 0 },
            expeditedThreshold: govExpeditedThreshold,
            expeditedMinDeposit: [{ denom: 'ufct', amount: govExpeditedMinDeposit }],
            burnVoteQuorum: govBurnVoteQuorum,
            burnProposalDepositPrevote: govBurnProposalDepositPrevote,
            burnVoteVeto: govBurnVoteVeto,
            minDepositRatio: govMinDepositRatio
          };
          const govMetadataEstimate = '';
          currentGas = await getGasEstimationSubmitGovParamsUpdateProposal(
            title,
            description,
            initialDeposit,
            govParamsEstimate,
            govMetadataEstimate
          );
          break;
        case 'SOFTWARE_UPGRADE':
          currentGas = await getGasEstimationSubmitSoftwareUpgrade(
            title,
            description,
            initialDeposit,
            upgradeName,
            height
          );
          break;
        case 'CANCEL_SOFTWARE_UPGRADE':
          currentGas = await getGasEstimationSubmitCancelSoftwareUpgrade(title, description, initialDeposit);
          break;
        case 'CANCEL_PROPOSAL':
          currentGas = await getGasEstimationCancelProposal(proposalId);
          break;
        default:
          break;
      }
    } catch (error) {
      enqueueSnackbar(error + '', {
        variant: 'error',
        autoHideDuration: 5000,
      });
    }

    if (currentGas > 0) {
      if (convertNumber(balance) - initialDeposit >= convertToFctNumber(getFeesFromGas(currentGas))) {
        modalActions.handleModalData({
          action: 'Proposal',
          module: `/gov${getGovModuleName()}`,
          data: { fees: getFeesFromGas(currentGas), gas: currentGas },
          prevModalAction: modalActions.handleModalNewProposal,
          txAction: newProposalTx,
          txParams: getParamsTx,
        });

        modalActions.handleModalConfirmTx(true);
      } else {
        enqueueSnackbar('Insufficient funds. Please check your account balance.', {
          variant: 'error',
          autoHideDuration: 2000,
        });
      }
    }
  };

  return (
    <Modal
      visible={newProposalState}
      closable={true}
      visibleClose={false}
      onClose={closeModal}
      width={newProposalModalWidth}
    >
      <ModalContainer>
        <ModalTitle>
          New Proposal
          <HelpIcon onClick={() => window.open(GUIDE_LINK_NEW_PROPOSAL)} />
        </ModalTitle>
        <ModalContent>
          <ModalInputWrap>
            <ModalLabel>Type</ModalLabel>
            <ModalInput>
              <SelectWrapper>
                <Select options={options} styles={customStyles} onChange={onChangeType} ref={selectInputRef} />
              </SelectWrapper>
            </ModalInput>
          </ModalInputWrap>

          <ModalInputWrap>
            <ModalLabel>Title</ModalLabel>
            <ModalInput>
              <InputBoxDefault type='text' placeholder='Proposal Title' value={title} onChange={onChangeTitle} />
            </ModalInput>
          </ModalInputWrap>

          <ModalInputWrap>
            <ModalLabel>Description</ModalLabel>
            <ModalInput>
              <TextAreaDefault value={description} placeholder='Proposal Description' onChange={onChangeDescription} />
            </ModalInput>
          </ModalInputWrap>
          <ModalInputWrap>
            <ModalLabel>Initial Deposit</ModalLabel>
            <ModalInput>
              <InputBoxDefault type='number' placeholder='' value={initialDeposit} onChange={onChangeInitialDeposit} />
            </ModalInput>
          </ModalInputWrap>
          {/* Parameter Change - Deprecated */}
          {proposalType === 'PARAMETER_CHANGE_PROPOSAL' && (
            <ModalInputWrap>
              <ModalLabel style={{ color: '#ff6b6b' }}>⚠️ Deprecated Feature</ModalLabel>
              <div style={{ padding: '15px', background: '#2a2a2a', border: '1px solid #ff6b6b', borderRadius: '4px', marginBottom: '15px' }}>
                <p style={{ color: '#ff6b6b', marginBottom: '10px', fontSize: '14px' }}>
                  <strong>Parameter Change Proposal is deprecated in v0.5</strong>
                </p>
                <p style={{ color: '#ccc', fontSize: '12px', marginBottom: '10px' }}>
                  Please use specific parameter update proposals instead:
                </p>
                <ul style={{ color: '#ccc', fontSize: '12px', paddingLeft: '20px', margin: '0' }}>
                  <li>• <strong>Staking Parameters:</strong> Use "StakingParamsUpdate" proposal</li>
                  <li>• <strong>Governance Parameters:</strong> Use "GovParamsUpdate" proposal</li>
                </ul>
              </div>
              <ModalLabel>Changes (Legacy)</ModalLabel>
              <ModalInput>
                <AddButton onClick={() => addParam()}>+</AddButton>
                <ParamTable>
                  <ParamHeader>
                    <Param>Subspace</Param>
                    <Param>Key</Param>
                    <Param>Value</Param>
                    <Param>X</Param>
                  </ParamHeader>
                  {paramList.map((param: any, index) => (
                    <ParamBody key={index}>
                      <Param>
                        <InputBoxDefault
                          type='text'
                          placeholder=''
                          value={param.subspace}
                          onChange={(e) => onChangeSubspace(e, index)}
                        />
                      </Param>
                      <Param>
                        <InputBoxDefault
                          type='text'
                          placeholder=''
                          value={param.key}
                          onChange={(e) => onChangeKey(e, index)}
                        />
                      </Param>
                      <Param>
                        <InputBoxDefault
                          type='text'
                          placeholder=''
                          value={param.value}
                          onChange={(e) => onChangeValue(e, index)}
                        />
                      </Param>
                      <Param>
                        <DeleteButton onClick={(e) => deleteParam(index)}>X</DeleteButton>
                      </Param>
                    </ParamBody>
                  ))}
                </ParamTable>
              </ModalInput>
            </ModalInputWrap>
          )}

          {/* CommunityPool */}
          {proposalType === 'COMMUNITY_POOL_SPEND_PROPOSAL' && (
            <>
              <ModalInputWrap>
                <ModalLabel>Recipient</ModalLabel>
                <ModalInput>
                  <InputBoxDefault
                    type='text'
                    placeholder='Enter Recipient Address'
                    value={recipient}
                    onChange={onChangeRecipient}
                  />
                </ModalInput>
              </ModalInputWrap>
              <ModalInputWrap>
                <ModalLabel>Amount</ModalLabel>
                <ModalInput>
                  <InputBoxDefault type='number' placeholder='' value={amount} onChange={onChangeAmount} />
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
                    type='text'
                    placeholder='v0.1.0'
                    value={upgradeName}
                    onChange={onChangeUpgradeName}
                  />
                </ModalInput>
              </ModalInputWrap>
              <ModalInputWrap>
                <ModalLabel>Height</ModalLabel>
                <ModalInput>
                  <InputBoxDefault type='number' placeholder='1' value={height} onChange={onChangeHeight} />
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
                    type='text'
                    placeholder='1814400s'
                    value={stakingUnbondingTime}
                    onChange={(e) => setStakingUnbondingTime(e.target.value)}
                  />
                </ModalInput>
              </ModalInputWrap>
              <ModalInputWrap>
                <ModalLabel>Max Validators</ModalLabel>
                <ModalInput>
                  <InputBoxDefault
                    type='number'
                    placeholder='100'
                    value={stakingMaxValidators}
                    onChange={(e) => setStakingMaxValidators(Number(e.target.value))}
                  />
                </ModalInput>
              </ModalInputWrap>
              <ModalInputWrap>
                <ModalLabel>Max Entries</ModalLabel>
                <ModalInput>
                  <InputBoxDefault
                    type='number'
                    placeholder='7'
                    value={stakingMaxEntries}
                    onChange={(e) => setStakingMaxEntries(Number(e.target.value))}
                  />
                </ModalInput>
              </ModalInputWrap>
              <ModalInputWrap>
                <ModalLabel>Historical Entries</ModalLabel>
                <ModalInput>
                  <InputBoxDefault
                    type='number'
                    placeholder='10000'
                    value={stakingHistoricalEntries}
                    onChange={(e) => setStakingHistoricalEntries(Number(e.target.value))}
                  />
                </ModalInput>
              </ModalInputWrap>
              <ModalInputWrap>
                <ModalLabel>Bond Denom</ModalLabel>
                <ModalInput>
                  <InputBoxDefault
                    type='text'
                    placeholder='ufct'
                    value={stakingBondDenom}
                    onChange={(e) => setStakingBondDenom(e.target.value)}
                  />
                </ModalInput>
              </ModalInputWrap>
              <ModalInputWrap>
                <ModalLabel>Min Commission Rate (decimal)</ModalLabel>
                <ModalInput>
                  <InputBoxDefault
                    type='text'
                    placeholder='0.05'
                    value={stakingMinCommissionRate}
                    onChange={(e) => setStakingMinCommissionRate(e.target.value)}
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
              <div style={{ padding: '15px', background: '#2a2a2a', border: '1px solid #4a90e2', borderRadius: '4px', marginBottom: '15px' }}>
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

          {/* Cancel Proposal */}
          {proposalType === 'CANCEL_PROPOSAL' && (
            <>
              <ModalInputWrap>
                <div style={{ padding: '15px', background: '#2a2a2a', border: '1px solid #ff6b6b', borderRadius: '4px', marginBottom: '15px' }}>
                  <p style={{ color: '#ff6b6b', marginBottom: '10px', fontSize: '14px' }}>
                    <strong>Cancel Proposal</strong>
                  </p>
                  <p style={{ color: '#ccc', fontSize: '12px', margin: '0' }}>
                    This will cancel an existing proposal that is still in the deposit or voting period.
                    Only the proposer can cancel their own proposal.
                  </p>
                </div>
              </ModalInputWrap>
              <ModalInputWrap>
                <ModalLabel>Proposal ID</ModalLabel>
                <ModalInput>
                  <InputBoxDefault
                    type='number'
                    placeholder='Enter proposal ID to cancel'
                    value={proposalId}
                    onChange={(e) => setProposalId(e.target.value)}
                  />
                  <div style={{ fontSize: '11px', color: '#888', marginTop: '5px' }}>
                    Enter the ID of the proposal you want to cancel
                  </div>
                </ModalInput>
              </ModalInputWrap>
            </>
          )}

          {/* Governance Parameters */}
          {proposalType === 'GOV_PARAMS_UPDATE_PROPOSAL' && (
            <>
              <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '10px' }}>
                <ModalInputWrap>
                  <ModalLabel>Min Deposit (ufct)</ModalLabel>
                  <ModalInput>
                    <InputBoxDefault
                      type='text'
                      placeholder='5000000000'
                      value={govMinDeposit}
                      onChange={(e) => setGovMinDeposit(e.target.value)}
                    />
                  </ModalInput>
                </ModalInputWrap>
                <ModalInputWrap>
                  <ModalLabel>Max Deposit Period (seconds)</ModalLabel>
                  <ModalInput>
                    <InputBoxDefault
                      type='text'
                      placeholder='172800s'
                      value={govMaxDepositPeriod}
                      onChange={(e) => setGovMaxDepositPeriod(e.target.value)}
                    />
                  </ModalInput>
                </ModalInputWrap>
                <ModalInputWrap>
                  <ModalLabel>Voting Period (seconds)</ModalLabel>
                  <ModalInput>
                    <InputBoxDefault
                      type='text'
                      placeholder='172800s'
                      value={govVotingPeriod}
                      onChange={(e) => setGovVotingPeriod(e.target.value)}
                    />
                  </ModalInput>
                </ModalInputWrap>
                <ModalInputWrap>
                  <ModalLabel>Quorum (decimal)</ModalLabel>
                  <ModalInput>
                    <InputBoxDefault
                      type='text'
                      placeholder='0.334000000000000000'
                      value={govQuorum}
                      onChange={(e) => setGovQuorum(e.target.value)}
                    />
                  </ModalInput>
                </ModalInputWrap>
                <ModalInputWrap>
                  <ModalLabel>Threshold (decimal)</ModalLabel>
                  <ModalInput>
                    <InputBoxDefault
                      type='text'
                      placeholder='0.500000000000000000'
                      value={govThreshold}
                      onChange={(e) => setGovThreshold(e.target.value)}
                    />
                  </ModalInput>
                </ModalInputWrap>
                <ModalInputWrap>
                  <ModalLabel>Veto Threshold (decimal)</ModalLabel>
                  <ModalInput>
                    <InputBoxDefault
                      type='text'
                      placeholder='0.334000000000000000'
                      value={govVetoThreshold}
                      onChange={(e) => setGovVetoThreshold(e.target.value)}
                    />
                  </ModalInput>
                </ModalInputWrap>
                <ModalInputWrap>
                  <ModalLabel>Min Initial Deposit Ratio (decimal)</ModalLabel>
                  <ModalInput>
                    <InputBoxDefault
                      type='text'
                      placeholder='0.100000000000000000'
                      value={govMinInitialDepositRatio}
                      onChange={(e) => setGovMinInitialDepositRatio(e.target.value)}
                    />
                  </ModalInput>
                </ModalInputWrap>
                <ModalInputWrap>
                  <ModalLabel>Proposal Cancel Ratio (decimal)</ModalLabel>
                  <ModalInput>
                    <InputBoxDefault
                      type='text'
                      placeholder='0.500000000000000000'
                      value={govProposalCancelRatio}
                      onChange={(e) => setGovProposalCancelRatio(e.target.value)}
                    />
                  </ModalInput>
                </ModalInputWrap>
                <ModalInputWrap>
                  <ModalLabel>Proposal Cancel Destination (optional)</ModalLabel>
                  <ModalInput>
                    <InputBoxDefault
                      type='text'
                      placeholder='community pool or address'
                      value={govProposalCancelDest}
                      onChange={(e) => setGovProposalCancelDest(e.target.value)}
                    />
                  </ModalInput>
                </ModalInputWrap>
                <ModalInputWrap>
                  <ModalLabel>Expedited Voting Period (seconds)</ModalLabel>
                  <ModalInput>
                    <InputBoxDefault
                      type='text'
                      placeholder='86400s'
                      value={govExpeditedVotingPeriod}
                      onChange={(e) => setGovExpeditedVotingPeriod(e.target.value)}
                    />
                  </ModalInput>
                </ModalInputWrap>
                <ModalInputWrap>
                  <ModalLabel>Expedited Threshold (decimal)</ModalLabel>
                  <ModalInput>
                    <InputBoxDefault
                      type='text'
                      placeholder='0.667000000000000000'
                      value={govExpeditedThreshold}
                      onChange={(e) => setGovExpeditedThreshold(e.target.value)}
                    />
                  </ModalInput>
                </ModalInputWrap>
                <ModalInputWrap>
                  <ModalLabel>Expedited Min Deposit (ufct)</ModalLabel>
                  <ModalInput>
                    <InputBoxDefault
                      type='text'
                      placeholder='10000000000'
                      value={govExpeditedMinDeposit}
                      onChange={(e) => setGovExpeditedMinDeposit(e.target.value)}
                    />
                  </ModalInput>
                </ModalInputWrap>
                <ModalInputWrap>
                  <ModalLabel>Burn Vote Quorum</ModalLabel>
                  <ModalInput>
                    <label style={{ display: 'flex', alignItems: 'center', color: '#ccc' }}>
                      <input
                        type="checkbox"
                        checked={govBurnVoteQuorum}
                        onChange={(e) => setGovBurnVoteQuorum(e.target.checked)}
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
                        checked={govBurnProposalDepositPrevote}
                        onChange={(e) => setGovBurnProposalDepositPrevote(e.target.checked)}
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
                        checked={govBurnVoteVeto}
                        onChange={(e) => setGovBurnVoteVeto(e.target.checked)}
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
                      type='text'
                      placeholder='0.010000000000000000'
                      value={govMinDepositRatio}
                      onChange={(e) => setGovMinDepositRatio(e.target.value)}
                    />
                  </ModalInput>
                </ModalInputWrap>
              </div>
            </>
          )}

          <ButtonWrapper>
            <CancelButton onClick={() => closeModal()} status={1}>
              Cancel
            </CancelButton>
            <NextButton
              onClick={() => {
                if (proposalType) nextStep();
              }}
              status={proposalType !== '' ? 0 : 2}
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
