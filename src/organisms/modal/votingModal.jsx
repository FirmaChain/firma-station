import React, { useState } from "react";
import { useSelector } from "react-redux";
import useFirma from "utils/wallet";

import { Modal } from "components/modal";
import { modalActions } from "redux/action";

import {
  votingModalWidth,
  ModalContainer,
  ModalTitle,
  ModalContent,
  NextButton,
  VotingWrapper,
  VotingItem,
} from "./styles";

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
    <Modal visible={votingModalState} closable={true} onClose={closeModal} width={votingModalWidth}>
      <ModalContainer>
        <ModalTitle>Voting</ModalTitle>
        <ModalContent>
          <VotingWrapper>
            <VotingItem active={votingType === 1} onClick={() => setVotingType(1)}>
              YES
            </VotingItem>
            <VotingItem active={votingType === 3} onClick={() => setVotingType(3)}>
              NO
            </VotingItem>
            <VotingItem active={votingType === 4} onClick={() => setVotingType(4)}>
              NoWithVeto
            </VotingItem>
            <VotingItem active={votingType === 2} onClick={() => setVotingType(2)}>
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
