import React, { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { GridLoader } from 'react-spinners';

import { Modal } from '../../components/modal';
import { modalActions, refreshActions, useModalStore } from '../../store';
import {
	AfterTypo,
	LoadingWrapper,
	ModalContainer,
	ModalContent,
	ModalTitle,
	ModalTooltipIcon,
	ModalTooltipTypo,
	ModalTooltipWrapper,
	queueTxModalWidth,
	QueueTypoOne,
	QueueTypoWrapper
} from './styles';

const QueueTxModal = () => {
	const queueTxModalState = useModalStore((state) => state.queueTx);
	const modalData = useModalStore((state) => state.data);

	const { enqueueSnackbar } = useSnackbar();
	const [depend, setDepend] = useState(false);

	useEffect(() => {
		if (queueTxModalState) {
			if (Object.keys(modalData).length > 0) {
				const gas = modalData.data.gas ? modalData.data.gas : 0;
				modalData.txAction(resolveTx, rejectTx, gas);
			}
		}

		const timer = setTimeout(() => {
			setDepend(true);
			clearTimeout(timer);
		}, 15000);

		return () => {
			clearTimeout(timer);
		};
	}, [queueTxModalState]); // eslint-disable-line react-hooks/exhaustive-deps

	const resolveTx = () => {
		enqueueSnackbar('Success Transaction', {
			variant: 'success',
			autoHideDuration: 1000
		});
		closeQueueTxModal();
		// Refresh on-chain data in place instead of reloading the whole page.
		refreshActions.handleRefresh();
	};

	const rejectTx = () => {
		enqueueSnackbar('Failed Transaction', {
			variant: 'error',
			autoHideDuration: 1000
		});
		closeQueueTxModal();
	};

	const closeQueueTxModal = () => {
		modalActions.handleModalQueueTx(false);
	};

	return (
		<Modal visible={queueTxModalState} closable={true} visibleClose={false} onClose={closeQueueTxModal} width={queueTxModalWidth}>
			<ModalContainer>
				<ModalTitle>Broadcasting Transaction</ModalTitle>
				<ModalContent>
					<LoadingWrapper>
						<GridLoader loading={true} color={'#3550DE80'} size={20} margin={4} />
					</LoadingWrapper>
					<QueueTypoWrapper>
						<QueueTypoOne>It can take up from 5 to 15 seconds for a transaction to be completed.</QueueTypoOne>
						<AfterTypo $isActive={depend}>
							<ModalTooltipWrapper>
								<ModalTooltipIcon />
								<ModalTooltipTypo>
									Depending on the condition of the network, it can take up to more than 15 seconds.
								</ModalTooltipTypo>
							</ModalTooltipWrapper>
						</AfterTypo>
					</QueueTypoWrapper>
				</ModalContent>
			</ModalContainer>
		</Modal>
	);
};

export default React.memo(QueueTxModal);
