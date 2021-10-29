import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import Select from "react-select";

import useFirma from "../../utils/wallet";
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
];

const customStyles = {
  control: (provided: any) => ({
    ...provided,
    backgroundColor: "#1B1C22",
    border: "1px solid #324ab8aa",
  }),
  option: (provided: any) => ({
    ...provided,
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
  const [paramList, setParamList] = useState<Array<any>>([]);

  const { submitParameterChangeProposal, submitCommunityPoolSpendProposal, submitTextProposal } = useFirma();

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
            resolveTx();
          })
          .catch(() => {
            rejectTx();
          });
        break;
      case "COMMUNITY_POOL_SPEND_PROPOSAL":
        submitCommunityPoolSpendProposal(title, description, initialDeposit, amount, recipient)
          .then(() => {
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
      default:
        break;
    }
    // TEXT_PROPOSAL
    // COMMUNITY_POOL_SPEND_PROPOSAL
    // PARAMETER_CHANGE_PROPOSAL
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

    if (isCommonInvalid || isCommunityPoolInvalid || isParameterChangeInvalid) {
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
        <ModalTitle>New Proposal</ModalTitle>
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

          <NextButton
            onClick={() => {
              if (proposalType) nextStep();
            }}
            active={proposalType !== ""}
          >
            NEXT
          </NextButton>
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
};

export default React.memo(NewProposalModal);
