import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import Select from "react-select";

import useFirma from "../../utils/wallet";
import { convertNumber } from "../../utils/common";
import { useApolloClient } from "@apollo/client";
import { rootState } from "../../redux/reducers";
import { Modal } from "../../components/modal";
import { modalActions } from "../../redux/action";

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

  const [proposalType, setProposalType] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [initialDeposit, setInitialDeposit] = useState(0);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState(0);
  const [upgradeName, setUpgradeName] = useState("");
  const [height, setHeight] = useState(1);
  const [paramList, setParamList] = useState<Array<any>>([]);

  const { submitParameterChangeProposal, submitCommunityPoolSpendProposal, submitTextProposal, submitSoftwareUpgrade } =
    useFirma();
  const { reFetchObservableQueries } = useApolloClient();

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

  const newProposalTx = (resolveTx: () => void, rejectTx: () => void) => {
    switch (proposalType) {
      case "TEXT_PROPOSAL":
        submitTextProposal(title, description, initialDeposit)
          .then(() => {
            reFetchObservableQueries();
            resolveTx();
          })
          .catch(() => {
            rejectTx();
          });
        break;
      case "COMMUNITY_POOL_SPEND_PROPOSAL":
        submitCommunityPoolSpendProposal(title, description, initialDeposit, amount, recipient)
          .then(() => {
            reFetchObservableQueries();
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
        submitParameterChangeProposal(title, description, initialDeposit, validParamList)
          .then(() => {
            resolveTx();
          })
          .catch(() => {
            rejectTx();
          });
        break;
      case "SOFTWARE_UPGRADE":
        submitSoftwareUpgrade(title, description, initialDeposit, upgradeName, convertNumber(height))
          .then(() => {
            reFetchObservableQueries();
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
    setInitialDeposit(e.target.value);
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

  const nextStep = () => {
    const validParamList = paramList.filter(
      (value: any) => value.subspace !== "" && value.key !== "" && value.value !== ""
    );

    const isCommonInvalid = title === "" || description === "" || initialDeposit === 0;
    const isCommunityPoolInvalid =
      proposalType === "COMMUNITY_POOL_SPEND_PROPOSAL" && (recipient === "" || amount === 0);
    const isParameterChangeInvalid = proposalType === "PARAMETER_CHANGE_PROPOSAL" && validParamList.length === 0;
    const isSoftwareUpgradeInvalid = proposalType === "SOFTWARE_UPGRADE" && (upgradeName === "" || height <= 0);

    if (isCommonInvalid || isCommunityPoolInvalid || isParameterChangeInvalid || isSoftwareUpgradeInvalid) {
      enqueueSnackbar("Invalid Parameters", {
        variant: "error",
        autoHideDuration: 1000,
      });

      return;
    }

    modalActions.handleModalData({
      action: "Proposal",
      data: {},
      prevModalAction: modalActions.handleModalNewProposal,
      txAction: newProposalTx,
    });

    closeModal();
    modalActions.handleModalConfirmTx(true);
  };

  return (
    <Modal visible={newProposalState} closable={true} onClose={closeModal} width={newProposalModalWidth}>
      <ModalContainer>
        <ModalTitle>NEW PROPOSAL</ModalTitle>
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
