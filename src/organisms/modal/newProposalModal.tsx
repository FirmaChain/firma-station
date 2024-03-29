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
  { value: 'PARAMETER_CHANGE_PROPOSAL', label: 'ParameterChange' },
  { value: 'SOFTWARE_UPGRADE', label: 'SoftwareUpgrade' },
  { value: 'CANCEL_SOFTWARE_UPGRADE', label: 'CancelSoftwareUpgrade' },
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
  const selectInputRef = useRef<any>();
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

  const {
    submitParameterChangeProposal,
    submitCommunityPoolSpendProposal,
    submitTextProposal,
    submitSoftwareUpgrade,
    submitCancelSoftwareUpgrade,
    getGasEstimationSubmitCancelSoftwareUpgrade,
    getGasEstimationSubmitParameterChangeProposal,
    getGasEstimationSubmitCommunityPoolSpendProposal,
    getGasEstimationSubmitSoftwareUpgrade,
    getGasEstimationSubmitTextProposal,
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
      case 'SOFTWARE_UPGRADE':
        submitSoftwareUpgrade(title, description, initialDeposit, upgradeName, convertNumber(height), gas)
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
      case 'SOFTWARE_UPGRADE':
        return {
          title,
          description,
          initialDepositFCT: initialDeposit,
          upgradeName,
          upgradeHeight: convertNumber(height),
        };
      case 'CANCEL_SOFTWARE_UPGRADE':
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
      case 'SOFTWARE_UPGRADE':
        return '/submit/softwareupgrade';
      case 'CANCEL_SOFTWARE_UPGRADE':
        return '/submit/cancelsoftwareupgrade';
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
    const isSoftwareUpgradeInvalid = proposalType === 'SOFTWARE_UPGRADE' && (upgradeName === '' || height <= 0);

    if (initialDeposit === 0) {
      enqueueSnackbar('Insufficient funds. Please check your account balance.', {
        variant: 'error',
        autoHideDuration: 2000,
      });

      return;
    }

    if (isCommonInvalid || isCommunityPoolInvalid || isParameterChangeInvalid || isSoftwareUpgradeInvalid) {
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
        case 'SOFTWARE_UPGRADE':
          currentGas = await getGasEstimationSubmitSoftwareUpgrade(
            title,
            description,
            initialDeposit,
            upgradeName,
            convertNumber(height)
          );
          break;
        case 'CANCEL_SOFTWARE_UPGRADE':
          currentGas = await getGasEstimationSubmitCancelSoftwareUpgrade(title, description, initialDeposit);
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
          {/* Parameter */}
          {proposalType === 'PARAMETER_CHANGE_PROPOSAL' && (
            <ModalInputWrap>
              <ModalLabel>Changes</ModalLabel>
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

          {/* CommunityPool */}
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
