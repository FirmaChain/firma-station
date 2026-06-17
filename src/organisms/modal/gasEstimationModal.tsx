import React from 'react';
import { GridLoader } from 'react-spinners';

import { Modal } from '../../components/modal';
import { modalActions, useModalStore } from '../../store';
import { gasEstimationModalWidth, LoadingWrapper, ModalContainer, ModalContent, ModalTitle, ModalTypo } from './styles';

const GasEstimationModal = () => {
	const gasEstimationModalState = useModalStore((state) => state.gasEstimation);

	const closeGasEstimationModal = () => {
		modalActions.handleModalGasEstimation(false);
	};

	return (
		<Modal visible={gasEstimationModalState} closable={false} onClose={closeGasEstimationModal} width={gasEstimationModalWidth}>
			<ModalContainer>
				<ModalTitle>Estimating the gas</ModalTitle>
				<ModalContent>
					<LoadingWrapper>
						<GridLoader loading={true} color={'#3550DE80'} />
					</LoadingWrapper>
					<ModalTypo>Calculating gas and fee...</ModalTypo>
				</ModalContent>
			</ModalContainer>
		</Modal>
	);
};

export default React.memo(GasEstimationModal);
