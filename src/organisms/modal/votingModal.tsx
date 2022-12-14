import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';

import useFirma from '../../utils/wallet';
import { rootState } from '../../redux/reducers';
import { Modal } from '../../components/modal';
import { modalActions } from '../../redux/action';
import { convertNumber, convertToFctNumber, getFeesFromGas } from '../../utils/common';

import {
  votingModalWidth,
  ModalContainer,
  ModalTitle,
  ModalContent,
  NextButton,
  VotingWrapper,
  VotingItem,
} from './styles';

const VotingModal = () => {
  const votingModalState = useSelector((state: rootState) => state.modal.voting);
  const modalData = useSelector((state: rootState) => state.modal.data);
  const { balance } = useSelector((state: rootState) => state.user);
  const { isLedger } = useSelector((state: rootState) => state.wallet);
  const [votingType, setVotingType] = useState(0);
  const { enqueueSnackbar } = useSnackbar();

  const { vote, getGasEstimationVote, setUserData } = useFirma();

  const closeModal = () => {
    resetModal();
    modalActions.handleModalVoting(false);
  };

  const resetModal = () => {
    setVotingType(0);
  };

  const votingTx = (resolveTx: () => void, rejectTx: () => void, gas = 0) => {
    vote(modalData.proposalId, votingType, gas)
      .then(() => {
        setUserData();
        resolveTx();
      })
      .catch(() => {
        rejectTx();
      });
  };

  const nextStep = () => {
    if (isLedger) modalActions.handleModalGasEstimation(true);

    closeModal();

    getGasEstimationVote(modalData.proposalId, votingType)
      .then((gas) => {
        if (isLedger) modalActions.handleModalGasEstimation(false);

        if (convertNumber(balance) >= convertToFctNumber(getFeesFromGas(gas))) {
          modalActions.handleModalData({
            action: 'Voting',
            data: { fees: getFeesFromGas(gas), gas },
            prevModalAction: modalActions.handleModalVoting,
            txAction: votingTx,
          });

          modalActions.handleModalConfirmTx(true);
        } else {
          enqueueSnackbar('Insufficient funds. Please check your account balance.', {
            variant: 'error',
            autoHideDuration: 2000,
          });
        }
      })
      .catch((e) => {
        enqueueSnackbar(e, {
          variant: 'error',
          autoHideDuration: 5000,
        });
        if (isLedger) modalActions.handleModalGasEstimation(false);
      });
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
            Vote
          </NextButton>
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
};

export default React.memo(VotingModal);
