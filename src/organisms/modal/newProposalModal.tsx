import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import Select from "react-select";

import useFirma from "../../utils/wallet";
import { convertNumber, convertToFctNumber, getFeesFromGas } from "../../utils/common";
import { rootState } from "../../redux/reducers";
import { Modal } from "../../components/modal";
import { modalActions } from "../../redux/action";
import { FIRMACHAIN_CONFIG, GUIDE_LINK_NEW_PROPOSAL } from "../../config";

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
} from "./styles";

const options = [
  { value: "TEXT_PROPOSAL", label: "Text" },
  { value: "COMMUNITY_POOL_SPEND_PROPOSAL", label: "CommunityPoolSpend" },
  { value: "PARAMETER_CHANGE_PROPOSAL", label: "ParameterChange" },
  { value: "SOFTWARE_UPGRADE", label: "SoftwareUpgrade" },
];

const customStyles = {
  control: (provided: any) => ({
    ...provided,
    backgroundColor: "#21212f",
    border: "1px solid #696974",
  }),
  option: (provided: any) => ({
    ...provided,
    color: "#3550DE",
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: "white",
  }),
  indicatorSeparator: (provided: any) => ({
    ...provided,
    color: "#324ab8aa",
    backgroundColor: "#324ab8aa",
  }),
  dropdownIndicator: (provided: any) => ({
    ...provided,
    color: "#324ab8aa",
  }),
};

const NewProposalModal = () => {
  const newProposalState = useSelector((state: rootState) => state.modal.newProposal);
  const selectInputRef = useRef<any>();
  const { enqueueSnackbar } = useSnackbar();
  const { balance } = useSelector((state: rootState) => state.user);
  const { isLedger } = useSelector((state: rootState) => state.wallet);

  const [proposalType, setProposalType] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [initialDeposit, setInitialDeposit] = useState(0);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState(0);
  const [upgradeName, setUpgradeName] = useState("");
  const [height, setHeight] = useState(1);
  const [paramList, setParamList] = useState<Array<any>>([]);

  const {
    submitParameterChangeProposal,
    submitCommunityPoolSpendProposal,
    submitTextProposal,
    submitSoftwareUpgrade,
    getGasEstimationSubmitParameterChangeProposal,
    getGasEstimationSubmitCommunityPoolSpendProposal,
    getGasEstimationSubmitSoftwareUpgrade,
    getGasEstimationSubmitTextProposal,
    setUserData,
  } = useFirma(false);

  const closeModal = () => {
    resetModal();
    modalActions.handleModalNewProposal(false);
  };

  const resetModal = () => {
    selectInputRef.current.clearValue();
    setProposalType("");
    resetAllParams();
  };

  const resetAllParams = () => {
    setTitle("");
    setDescription("");
    setInitialDeposit(0);
    setRecipient("");
    setAmount(0);
    setParamList([]);
  };

  const newProposalTx = (resolveTx: () => void, rejectTx: () => void, gas = 0) => {
    switch (proposalType) {
      case "TEXT_PROPOSAL":
        submitTextProposal(title, description, initialDeposit, gas)
          .then(() => {
            setUserData();
            resolveTx();
          })
          .catch(() => {
            rejectTx();
          });
        break;
      case "COMMUNITY_POOL_SPEND_PROPOSAL":
        submitCommunityPoolSpendProposal(title, description, initialDeposit, amount, recipient, gas)
          .then(() => {
            setUserData();
            resolveTx();
          })
          .catch(() => {
            rejectTx();
          });
        break;
      case "PARAMETER_CHANGE_PROPOSAL":
        const validParamList = paramList.filter(
          (value: any) => value.subspace !== "" && value.key !== "" && value.value !== ""
        );
        submitParameterChangeProposal(title, description, initialDeposit, validParamList, gas)
          .then(() => {
            resolveTx();
          })
          .catch(() => {
            rejectTx();
          });
        break;
      case "SOFTWARE_UPGRADE":
        submitSoftwareUpgrade(title, description, initialDeposit, upgradeName, convertNumber(height), gas)
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

    let amount: string = value.replace(/[^0-9.]/g, "");

    if (amount === "") {
      setInitialDeposit(0);
      return;
    }

    const pattern = /(^\d+$)|(^\d{1,}.\d{0,6}$)/;

    if (!pattern.test(amount)) {
      amount = convertNumber(amount).toFixed(6);
    }

    if (convertNumber(amount) > getMaxAmount()) {
      amount = getMaxAmount().toString();
    }

    setInitialDeposit(convertNumber(amount));
  };

  const getMaxAmount = () => {
    const value = convertNumber((convertNumber(balance) - convertToFctNumber(FIRMACHAIN_CONFIG.defaultFee)).toFixed(6));

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
    setParamList((prevState) => [...prevState, { subspace: "", key: "", value: "" }]);
  };

  const deleteParam = (index: number) => {
    setParamList((prevState) => [...prevState.filter((v, i) => i !== index)]);
  };

  const nextStep = async () => {
    const validParamList = paramList.filter(
      (value: any) => value.subspace !== "" && value.key !== "" && value.value !== ""
    );

    const isCommonInvalid = title === "" || description === "" || initialDeposit === 0;
    const isCommunityPoolInvalid =
      proposalType === "COMMUNITY_POOL_SPEND_PROPOSAL" && (recipient === "" || amount === 0);
    const isParameterChangeInvalid = proposalType === "PARAMETER_CHANGE_PROPOSAL" && validParamList.length === 0;
    const isSoftwareUpgradeInvalid = proposalType === "SOFTWARE_UPGRADE" && (upgradeName === "" || height <= 0);

    if (initialDeposit === 0) {
      enqueueSnackbar("Insufficient funds. Please check your account balance.", {
        variant: "error",
        autoHideDuration: 2000,
      });

      return;
    }

    if (isCommonInvalid || isCommunityPoolInvalid || isParameterChangeInvalid || isSoftwareUpgradeInvalid) {
      enqueueSnackbar("Invalid Parameters", {
        variant: "error",
        autoHideDuration: 2000,
      });

      return;
    }

    closeModal();
    if (isLedger) modalActions.handleModalGasEstimation(true);

    let currentGas: number = 0;

    try {
      switch (proposalType) {
        case "TEXT_PROPOSAL":
          currentGas = await getGasEstimationSubmitTextProposal(title, description, initialDeposit);
          break;
        case "COMMUNITY_POOL_SPEND_PROPOSAL":
          currentGas = await getGasEstimationSubmitCommunityPoolSpendProposal(
            title,
            description,
            initialDeposit,
            amount,
            recipient
          );
          break;
        case "PARAMETER_CHANGE_PROPOSAL":
          const validParamList = paramList.filter(
            (value: any) => value.subspace !== "" && value.key !== "" && value.value !== ""
          );
          currentGas = await getGasEstimationSubmitParameterChangeProposal(
            title,
            description,
            initialDeposit,
            validParamList
          );
          break;
        case "SOFTWARE_UPGRADE":
          currentGas = await getGasEstimationSubmitSoftwareUpgrade(
            title,
            description,
            initialDeposit,
            upgradeName,
            convertNumber(height)
          );
          break;
        default:
          break;
      }
    } catch (e) {
      enqueueSnackbar(e + "", {
        variant: "error",
        autoHideDuration: 5000,
      });
    }

    if (isLedger) modalActions.handleModalGasEstimation(false);

    if (currentGas > 0) {
      if (convertNumber(balance) - initialDeposit >= convertToFctNumber(getFeesFromGas(currentGas))) {
        modalActions.handleModalData({
          action: "Proposal",
          data: { fees: getFeesFromGas(currentGas), gas: currentGas },
          prevModalAction: modalActions.handleModalNewProposal,
          txAction: newProposalTx,
        });

        modalActions.handleModalConfirmTx(true);
      } else {
        enqueueSnackbar("Insufficient funds. Please check your account balance.", {
          variant: "error",
          autoHideDuration: 2000,
        });
      }
    }
  };

  return (
    <Modal visible={newProposalState} closable={true} onClose={closeModal} width={newProposalModalWidth}>
      <ModalContainer>
        <ModalTitle>
          NEW PROPOSAL
          <HelpIcon onClick={() => window.open(GUIDE_LINK_NEW_PROPOSAL)} />
        </ModalTitle>
        <ModalContent>
          <ModalLabel>Type</ModalLabel>
          <ModalInput>
            <SelectWrapper>
              <Select options={options} styles={customStyles} onChange={onChangeType} ref={selectInputRef} />
            </SelectWrapper>
          </ModalInput>

          <ModalLabel>Title</ModalLabel>
          <ModalInput>
            <InputBoxDefault type="text" placeholder="" value={title} onChange={onChangeTitle} />
          </ModalInput>

          <ModalLabel>Description</ModalLabel>
          <ModalInput>
            <TextAreaDefault value={description} onChange={onChangeDescription} />
          </ModalInput>

          <ModalLabel>Initial Deposit</ModalLabel>
          <ModalInput>
            <InputBoxDefault type="number" placeholder="" value={initialDeposit} onChange={onChangeInitialDeposit} />
          </ModalInput>

          {/* Parameter */}
          {proposalType === "PARAMETER_CHANGE_PROPOSAL" && (
            <>
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
                          type="text"
                          placeholder=""
                          value={param.subspace}
                          onChange={(e) => onChangeSubspace(e, index)}
                        />
                      </Param>
                      <Param>
                        <InputBoxDefault
                          type="text"
                          placeholder=""
                          value={param.key}
                          onChange={(e) => onChangeKey(e, index)}
                        />
                      </Param>
                      <Param>
                        <InputBoxDefault
                          type="text"
                          placeholder=""
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
            </>
          )}

          {/* CommunityPool */}
          {proposalType === "COMMUNITY_POOL_SPEND_PROPOSAL" && (
            <>
              <ModalLabel>Recipient</ModalLabel>
              <ModalInput>
                <InputBoxDefault type="text" placeholder="" value={recipient} onChange={onChangeRecipient} />
              </ModalInput>

              <ModalLabel>Amount</ModalLabel>
              <ModalInput>
                <InputBoxDefault type="number" placeholder="" value={amount} onChange={onChangeAmount} />
              </ModalInput>
            </>
          )}

          {/* CommunityPool */}
          {proposalType === "SOFTWARE_UPGRADE" && (
            <>
              <ModalLabel>Upgrade Name</ModalLabel>
              <ModalInput>
                <InputBoxDefault type="text" placeholder="v0.1.0" value={upgradeName} onChange={onChangeUpgradeName} />
              </ModalInput>

              <ModalLabel>Height</ModalLabel>
              <ModalInput>
                <InputBoxDefault type="number" placeholder="1" value={height} onChange={onChangeHeight} />
              </ModalInput>
            </>
          )}

          <NextButton
            onClick={() => {
              if (proposalType) nextStep();
            }}
            active={proposalType !== ""}
          >
            Next
          </NextButton>
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
};

export default React.memo(NewProposalModal);
