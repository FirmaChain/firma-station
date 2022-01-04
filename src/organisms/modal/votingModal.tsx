import React, { useState } from "react";
import { useSelector } from "react-redux";

import useFirma from "../../utils/wallet";
import { useApolloClient } from "@apollo/client";
import { rootState } from "../../redux/reducers";
import { Modal } from "../../components/modal";
import { modalActions } from "../../redux/action";

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
  const votingModalState = useSelector((state: rootState) => state.modal.voting);
  const modalData = useSelector((state: rootState) => state.modal.data);
  const [votingType, setVotingType] = useState(0);

  const { vote } = useFirma();
  const { reFetchObservableQueries } = useApolloClient();

  const closeModal = () => {
    resetModal();
    modalActions.handleModalVoting(false);
  };

  const resetModal = () => {
    setVotingType(0);
  };

  const votingTx = (resolveTx: () => void, rejectTx: () => void) => {
    vote(modalData.proposalId, votingType)
      .then(() => {
        reFetchObservableQueries();
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
        <ModalTitle>VOTING</ModalTitle>
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
            active={votingType !== 0}
          >
            vote
          </NextButton>
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
};

export default React.memo(VotingModal);
