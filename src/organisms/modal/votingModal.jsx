import React, { useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

import useFirma from "utils/wallet";

import { Modal } from "components/modal";
import { modalActions } from "redux/action";

import { ModalContainer, ModalTitle, ModalContent, NextButton } from "./styles";

const VotingWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 30px;
`;
const VotingItem = styled.div`
  width: calc(50% - 12px);
  height: 50px;
  line-height: 50px;
  cursor: pointer;
  border-radius: 4px;
  border: 1px solid #3550de80;
  text-align: center;
  ${(props) => props.active && "background-color:#3550DE80"}
`;

const VotingModal = () => {
  const votingModalState = useSelector((state) => state.modal.voting);
  const modalData = useSelector((state) => state.modal.data);
  const [votingType, setVotingType] = useState(0);

  const { vote } = useFirma();

  const closeModal = () => {
    resetModal();
    modalActions.handleModalVoting(false);
  };

  const resetModal = () => {
    setVotingType(0);
  };

  const votingTx = (resolveTx, rejectTx) => {
    vote(modalData.proposalId, votingType)
      .then(() => {
        resolveTx();
      })
      .catch(() => {
        rejectTx();
      });
  };

  const nextStep = () => {
    modalActions.handleModalData({
      action: "Voting",
      data: {},
      prevModalAction: modalActions.handleModalVoting,
      txAction: votingTx,
    });

    closeModal();
    modalActions.handleModalConfirmTx(true);
  };

  return (
    <Modal visible={votingModalState} closable={true} maskClosable={true} onClose={closeModal} width={"500px"}>
      <ModalContainer>
        <ModalTitle>Voting</ModalTitle>
        <ModalContent>
          <VotingWrapper>
            <VotingItem active={votingType === 1} onClick={() => setVotingType(1)}>
              YES
            </VotingItem>
            <VotingItem active={votingType === 2} onClick={() => setVotingType(2)}>
              NO
            </VotingItem>
            <VotingItem active={votingType === 3} onClick={() => setVotingType(3)}>
              NoWithVeto
            </VotingItem>
            <VotingItem active={votingType === 4} onClick={() => setVotingType(4)}>
              Abstain
            </VotingItem>
          </VotingWrapper>
          <NextButton
            onClick={() => {
              if (votingType) nextStep();
            }}
            active={votingType}
          >
            Vote
          </NextButton>
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
};

export default VotingModal;
