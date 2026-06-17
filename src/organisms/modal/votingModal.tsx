import React, { useState } from 'react';
import { useSnackbar } from 'notistack';

import { Modal } from '../../components/modal';
import { modalActions, useModalStore, useUserStore, useWalletStore } from '../../store';
import { convertNumber, convertToFctNumber, getFeesFromGas } from '../../utils/common';
import useFirma from '../../utils/wallet';
import {
	ButtonWrapper,
	CancelButton,
	ModalContainer,
	ModalContent,
	ModalTitle,
	NextButton,
	VotingItem,
	votingModalWidth,
	VotingWrapper
} from './styles';

const VotingModal = () => {
	const votingModalState = useModalStore((state) => state.voting);
	const modalData = useModalStore((state) => state.data);
	const { balance } = useUserStore((state) => state);
	const { isLedger } = useWalletStore((state) => state);
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

	const getParamsTx = () => {
		return {
			proposalId: convertNumber(modalData.proposalId),
			option: votingType
		};
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
		closeModal();

		getGasEstimationVote(modalData.proposalId, votingType)
			.then((gas) => {
				if (convertNumber(balance) >= convertToFctNumber(getFeesFromGas(gas, isLedger))) {
					modalActions.handleModalData({
						action: 'Voting',
						module: '/gov/vote',
						data: { fees: getFeesFromGas(gas, isLedger), gas },
						prevModalAction: modalActions.handleModalVoting,
						txAction: votingTx,
						txParams: getParamsTx
					});

					modalActions.handleModalConfirmTx(true);
				} else {
					enqueueSnackbar('Insufficient funds. Please check your account balance.', {
						variant: 'error',
						autoHideDuration: 2000
					});
				}
			})
			.catch((e) => {
				enqueueSnackbar(e?.message ?? String(e), {
					variant: 'error',
					autoHideDuration: 5000
				});
			});
	};

	return (
		<Modal visible={votingModalState} closable={true} visibleClose={false} onClose={closeModal} width={votingModalWidth}>
			<ModalContainer>
				<ModalTitle>Voting</ModalTitle>
				<ModalContent>
					<VotingWrapper>
						<VotingItem $active={votingType === 1} onClick={() => setVotingType(1)}>
							YES
						</VotingItem>
						<VotingItem $active={votingType === 3} onClick={() => setVotingType(3)}>
							NO
						</VotingItem>
						<VotingItem $active={votingType === 4} onClick={() => setVotingType(4)}>
							NoWithVeto
						</VotingItem>
						<VotingItem $active={votingType === 2} onClick={() => setVotingType(2)}>
							Abstain
						</VotingItem>
					</VotingWrapper>
					<ButtonWrapper>
						<CancelButton onClick={() => closeModal()} $status={1}>
							Cancel
						</CancelButton>
						<NextButton
							onClick={() => {
								if (votingType) nextStep();
							}}
							$status={votingType !== 0 ? 0 : 2}
						>
							Vote
						</NextButton>
					</ButtonWrapper>
				</ModalContent>
			</ModalContainer>
		</Modal>
	);
};

export default React.memo(VotingModal);
