import React from 'react';
import { useSelector } from 'react-redux';
import { GridLoader } from 'react-spinners';

import { Modal } from '../../components/modal';
import { modalActions } from '../../redux/action';
import { rootState } from '../../redux/reducers';
import { gasEstimationModalWidth, LoadingWrapper, ModalContainer, ModalContent, ModalTitle, ModalTypo } from './styles';

const GasEstimationModal = () => {
	const gasEstimationModalState = useSelector((state: rootState) => state.modal.gasEstimation);

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
