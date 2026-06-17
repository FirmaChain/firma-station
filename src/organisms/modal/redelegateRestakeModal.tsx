import React, { useEffect, useState } from 'react';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Tooltip from '@mui/material/Tooltip';
import { useSnackbar } from 'notistack';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { Modal } from '../../components/modal';
import { CHAIN_CONFIG } from '../../config';
import { SEND_COLOR } from '../../constants/transactions';
import { modalActions } from '../../redux/action';
import { rootState } from '../../redux/reducers';
import { getAvatarInfo } from '../../utils/avatar';
import { convertNumber, convertNumberFormat, convertToFctNumber, getFeesFromGas } from '../../utils/common';
import useFirma from '../../utils/wallet';
import {
	ButtonWrapper,
	CancelButton,
	ModalContainer,
	ModalContent,
	ModalInputRowWrap,
	ModalLabel,
	ModalTitle,
	ModalTooltipIcon,
	ModalTooltipTypo,
	ModalTooltipWrapper,
	ModalValue,
	NextButton,
	redelegateRestakeModalWidth
} from './styles';

const OptionsWrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: 10px;
`;

const OptionsHeader = styled.div`
	display: flex;
	align-items: center;
	gap: 6px;
	color: #ccc;
	font-size: 1.3rem;
	font-weight: 600;
`;

const InfoIconWrap = styled.span`
	display: inline-flex;
	align-items: center;
	cursor: help;
`;

const InfoIcon = styled(InfoOutlinedIcon)`
	&& {
		width: 16px;
		height: 16px;
		color: #888;
	}
`;

const ValidatorCard = styled.div`
	display: flex;
	flex-direction: column;
	gap: 10px;
	padding: 12px 14px;
	background-color: #3d3b48;
	border-radius: 4px;
`;

const ValidatorCardHeader = styled.label`
	display: flex;
	align-items: center;
	gap: 12px;
	min-width: 0;
	cursor: pointer;
`;

const CardIdentity = styled.div`
	display: flex;
	flex-direction: column;
	gap: 2px;
	flex: 1 1 auto;
	min-width: 0;
`;

const ValidatorAvatar = styled.div<{ $src?: string }>`
	width: 40px;
	min-width: 40px;
	height: 40px;
	border-radius: 20px;
	background-color: #555;
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;
	${(p) => (p.$src ? `background-image: url('${p.$src}');` : `background-image: url('${p.theme.urls.profile}');`)}
`;

const RoleLabel = styled.span<{ $variant: 'source' | 'dest' }>`
	font-size: 1.1rem;
	text-transform: uppercase;
	letter-spacing: 0.04em;
	font-weight: 600;
	color: ${(p) => (p.$variant === 'source' ? '#ff8a8a' : SEND_COLOR)};
	flex-shrink: 0;
`;

const CardMoniker = styled.span`
	font-weight: 600;
	color: #fff;
	font-size: 1.3rem;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	min-width: 0;
	flex: 1 1 auto;
`;

const RestakeToggleHint = styled.span`
	color: #888;
	font-size: 1.1rem;
	font-style: italic;
`;

const InfoRow = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: baseline;
	font-size: 1.2rem;
	color: #888;
`;

const InfoValue = styled.span`
	color: #ccc;
	font-variant-numeric: tabular-nums;
`;

const Delta = styled.span<{ $direction: 'in' | 'out' }>`
	color: ${(p) => (p.$direction === 'out' ? '#ff8a8a' : SEND_COLOR)};
	font-variant-numeric: tabular-nums;
`;

interface IRedelegateRestakeData {
	sourceValidator: string;
	sourceValidatorMoniker: string;
	sourceAmount: number;
	targetValidator: string;
	targetValidatorMoniker: string;
	amount: string;
	allowValidatorList: string[];
}

const RedelegateRestakeModal = () => {
	const redelegateRestakeModalState = useSelector((state: rootState) => state.modal.redelegateRestake);
	const modalData = useSelector((state: rootState) => state.modal.data);
	const { balance } = useSelector((state: rootState) => state.user);
	const { isLedger, isMobileApp } = useSelector((state: rootState) => state.wallet);
	const { avatarList } = useSelector((state: rootState) => state.avatar);
	const { enqueueSnackbar } = useSnackbar();

	const { redelegate, redelegateWithGrant, getGasEstimationRedelegate, getGasEstimationRedelegateWithGrant, getDelegation, setUserData } =
		useFirma();

	const [ctx, setCtx] = useState<IRedelegateRestakeData>({
		sourceValidator: '',
		sourceValidatorMoniker: '',
		sourceAmount: 0,
		targetValidator: '',
		targetValidatorMoniker: '',
		amount: '',
		allowValidatorList: []
	});
	const [includeDstInRestake, setIncludeDstInRestake] = useState(false);
	const [includeSrcInRestake, setIncludeSrcInRestake] = useState(false);
	const [removeSrcFromRestake, setRemoveSrcFromRestake] = useState(false);
	const [removeDstFromRestake, setRemoveDstFromRestake] = useState(false);
	const [destDelegation, setDestDelegation] = useState<number | null>(null);

	useEffect(() => {
		if (redelegateRestakeModalState && modalData?.data) {
			setCtx({
				sourceValidator: modalData.data.sourceValidator || '',
				sourceValidatorMoniker: modalData.data.sourceValidatorMoniker || modalData.data.sourceValidator || '',
				sourceAmount: modalData.data.sourceAmount || 0,
				targetValidator: modalData.data.targetValidator || '',
				targetValidatorMoniker: modalData.data.targetValidatorMoniker || modalData.data.targetValidator || '',
				amount: modalData.data.amount || '',
				allowValidatorList: modalData.data.allowValidatorList || []
			});
			setIncludeDstInRestake(false);
			setIncludeSrcInRestake(false);
			setRemoveSrcFromRestake(false);
			setRemoveDstFromRestake(false);
			setDestDelegation(null);

			const dst = modalData.data.targetValidator;
			if (dst) {
				getDelegation(dst)
					.then((d) => setDestDelegation(d ? convertToFctNumber(d.amount) : 0))
					.catch(() => setDestDelegation(0));
			}
		}
	}, [redelegateRestakeModalState]); // eslint-disable-line react-hooks/exhaustive-deps

	const closeModal = () => {
		modalActions.handleModalRedelegateRestake(false);
	};

	// Go back to the Redelegate input modal; modalData carries the previous
	// inputs so the user re-enters the modal with source/amount restored.
	const goBackToRedelegate = () => {
		modalActions.handleModalRedelegateRestake(false);
		modalActions.handleModalRedelegate(true);
	};

	const getNextYearExpiration = () => {
		const date = new Date();
		date.setFullYear(date.getFullYear() + 1);
		return date;
	};

	// Apply card-header toggles to the existing allow_list:
	//   - Source card checked when not already listed      → add sourceValidator
	//   - Source card unchecked when already listed         → drop sourceValidator
	//   - Destination card checked when not already listed → add targetValidator
	//   - Destination card unchecked when already listed   → drop targetValidator
	const getCombinedAllowList = () => {
		const set = new Set(ctx.allowValidatorList);
		if (removeSrcFromRestake) set.delete(ctx.sourceValidator);
		if (includeSrcInRestake) set.add(ctx.sourceValidator);
		if (removeDstFromRestake) set.delete(ctx.targetValidator);
		if (includeDstInRestake) set.add(ctx.targetValidator);
		return Array.from(set);
	};

	const redelegateTx = (resolveTx: () => void, rejectTx: () => void, gas = 0) => {
		redelegate(ctx.sourceValidator, ctx.targetValidator, convertNumber(ctx.amount), gas)
			.then(() => {
				setUserData();
				resolveTx();
			})
			.catch(() => {
				rejectTx();
			});
	};

	const getRedelegateParamsTx = () => {
		return {
			validatorSrcAddress: ctx.sourceValidator,
			validatorDstAddress: ctx.targetValidator,
			amount: ctx.amount
		};
	};

	const redelegateWithGrantTx = (resolveTx: () => void, rejectTx: () => void, gas = 0) => {
		redelegateWithGrant(
			ctx.sourceValidator,
			ctx.targetValidator,
			convertNumber(ctx.amount),
			getCombinedAllowList(),
			getNextYearExpiration(),
			0,
			gas
		)
			.then(() => {
				setUserData();
				resolveTx();
			})
			.catch(() => {
				rejectTx();
			});
	};

	const getCombinedParamsTx = () => {
		return {
			validatorSrcAddress: ctx.sourceValidator,
			validatorDstAddress: ctx.targetValidator,
			amount: ctx.amount,
			grantee: CHAIN_CONFIG.RESTAKE.ADDRESS,
			validatorAddressList: getCombinedAllowList(),
			maxTokens: '0',
			expirationDate: getNextYearExpiration().toISOString()
		};
	};

	const proceedRedelegateOnly = () => {
		closeModal();
		modalActions.handleModalGasEstimation(true);

		getGasEstimationRedelegate(ctx.sourceValidator, ctx.targetValidator, convertNumber(ctx.amount))
			.then((gas) => {
				modalActions.handleModalGasEstimation(false);
				if (isMobileApp) gas += 50000;
				if (convertNumber(balance) >= convertToFctNumber(getFeesFromGas(gas, isLedger))) {
					modalActions.handleModalData({
						action: 'Redelegate',
						module: '/staking/redelegate',
						data: { amount: ctx.amount, fees: getFeesFromGas(gas, isLedger), gas },
						txAction: redelegateTx,
						txParams: getRedelegateParamsTx
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
				modalActions.handleModalGasEstimation(false);
				enqueueSnackbar(e?.message ?? String(e), {
					variant: 'error',
					autoHideDuration: 5000
				});
			});
	};

	const proceedRedelegateWithGrant = () => {
		closeModal();
		modalActions.handleModalGasEstimation(true);

		getGasEstimationRedelegateWithGrant(
			ctx.sourceValidator,
			ctx.targetValidator,
			convertNumber(ctx.amount),
			getCombinedAllowList(),
			getNextYearExpiration(),
			0
		)
			.then((gas) => {
				modalActions.handleModalGasEstimation(false);
				if (isMobileApp) gas += 50000;
				if (convertNumber(balance) >= convertToFctNumber(getFeesFromGas(gas, isLedger))) {
					modalActions.handleModalData({
						action: 'Redelegate + Restake',
						module: '/staking/redelegate-with-grant',
						data: { amount: ctx.amount, fees: getFeesFromGas(gas, isLedger), gas, messageCount: 2 },
						txAction: redelegateWithGrantTx,
						txParams: getCombinedParamsTx
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
				modalActions.handleModalGasEstimation(false);
				enqueueSnackbar(e?.message ?? String(e), {
					variant: 'error',
					autoHideDuration: 5000
				});
			});
	};

	// Same short-circuit as before: if the resulting allow_list is identical to
	// the current one (no-op checkboxes), skip the grant message entirely.
	const onClickNext = () => {
		const next = getCombinedAllowList();
		const same = next.length === ctx.allowValidatorList.length && next.every((v) => ctx.allowValidatorList.includes(v));
		if (same) {
			proceedRedelegateOnly();
			return;
		}
		proceedRedelegateWithGrant();
	};

	const dstAlreadyInRestake = ctx.allowValidatorList.includes(ctx.targetValidator);
	const srcInRestake = ctx.allowValidatorList.includes(ctx.sourceValidator);
	const hasPendingChange =
		(!dstAlreadyInRestake && includeDstInRestake) ||
		(dstAlreadyInRestake && removeDstFromRestake) ||
		(!srcInRestake && includeSrcInRestake) ||
		(srcInRestake && removeSrcFromRestake);
	const sourceAvatar = getAvatarInfo(avatarList, ctx.sourceValidator);
	const destAvatar = getAvatarInfo(avatarList, ctx.targetValidator);

	return (
		<Modal
			visible={redelegateRestakeModalState}
			closable={true}
			visibleClose={false}
			onClose={goBackToRedelegate}
			width={redelegateRestakeModalWidth}
		>
			<ModalContainer>
				<ModalTitle>Restake</ModalTitle>
				<ModalContent>
					<ModalInputRowWrap>
						<ModalLabel>Source Validator</ModalLabel>
						<ModalValue title={ctx.sourceValidatorMoniker}>{ctx.sourceValidatorMoniker}</ModalValue>
					</ModalInputRowWrap>
					<ModalInputRowWrap style={{ marginBottom: '30px' }}>
						<ModalLabel>Destination Validator</ModalLabel>
						<ModalValue title={ctx.targetValidatorMoniker}>{ctx.targetValidatorMoniker}</ModalValue>
					</ModalInputRowWrap>

					<OptionsWrapper>
						<OptionsHeader>
							Update Restake Options
							<Tooltip
								title="Check an option to update your Restake validator list along with this redelegation. A single transaction with two messages (Redelegation + Restake update) will be broadcast."
								arrow
								placement="top"
								enterTouchDelay={0}
								componentsProps={{
									tooltip: {
										sx: {
											fontSize: '1.3rem',
											lineHeight: 1.5,
											maxWidth: 320,
											padding: '10px 12px'
										}
									}
								}}
							>
								<InfoIconWrap>
									<InfoIcon />
								</InfoIconWrap>
							</Tooltip>
						</OptionsHeader>

						<ValidatorCard>
							<ValidatorCardHeader>
								<input
									type="checkbox"
									checked={srcInRestake ? !removeSrcFromRestake : includeSrcInRestake}
									onChange={(e) => {
										if (srcInRestake) setRemoveSrcFromRestake(!e.target.checked);
										else setIncludeSrcInRestake(e.target.checked);
									}}
								/>
								<ValidatorAvatar $src={sourceAvatar.avatarURL} />
								<CardIdentity>
									<RoleLabel $variant="source">Source</RoleLabel>
									<CardMoniker title={ctx.sourceValidatorMoniker}>{ctx.sourceValidatorMoniker}</CardMoniker>
									<RestakeToggleHint>
										{srcInRestake
											? removeSrcFromRestake
												? 'will be removed from Restake list'
												: 'in Restake list'
											: includeSrcInRestake
												? 'will be added to Restake list'
												: 'not in Restake list'}
									</RestakeToggleHint>
								</CardIdentity>
							</ValidatorCardHeader>
							<InfoRow>
								<span>Redelegate amount</span>
								<InfoValue>
									<Delta $direction="out">
										-{ctx.amount} {CHAIN_CONFIG.PARAMS.SYMBOL}
									</Delta>
								</InfoValue>
							</InfoRow>
							<InfoRow>
								<span>Remaining balance</span>
								<InfoValue>
									{convertNumberFormat(Math.max(ctx.sourceAmount - convertNumber(ctx.amount), 0), 6)}{' '}
									{CHAIN_CONFIG.PARAMS.SYMBOL}
								</InfoValue>
							</InfoRow>
						</ValidatorCard>

						<ValidatorCard>
							<ValidatorCardHeader>
								<input
									type="checkbox"
									checked={dstAlreadyInRestake ? !removeDstFromRestake : includeDstInRestake}
									onChange={(e) => {
										if (dstAlreadyInRestake) setRemoveDstFromRestake(!e.target.checked);
										else setIncludeDstInRestake(e.target.checked);
									}}
								/>
								<ValidatorAvatar $src={destAvatar.avatarURL} />
								<CardIdentity>
									<RoleLabel $variant="dest">Destination</RoleLabel>
									<CardMoniker title={ctx.targetValidatorMoniker}>{ctx.targetValidatorMoniker}</CardMoniker>
									<RestakeToggleHint>
										{dstAlreadyInRestake
											? removeDstFromRestake
												? 'will be removed from Restake list'
												: 'already in Restake list'
											: includeDstInRestake
												? 'will be added to Restake list'
												: 'not in Restake list'}
									</RestakeToggleHint>
								</CardIdentity>
							</ValidatorCardHeader>
							<InfoRow>
								<span>Amount to receive</span>
								<InfoValue>
									<Delta $direction="in">
										+{ctx.amount} {CHAIN_CONFIG.PARAMS.SYMBOL}
									</Delta>
								</InfoValue>
							</InfoRow>
							<InfoRow>
								<span>Total delegation after redelegation</span>
								<InfoValue>
									{destDelegation === null
										? '…'
										: `${convertNumberFormat(destDelegation + convertNumber(ctx.amount), 6)} ${
												CHAIN_CONFIG.PARAMS.SYMBOL
											}`}
								</InfoValue>
							</InfoRow>
						</ValidatorCard>
					</OptionsWrapper>

					<ModalTooltipWrapper>
						<ModalTooltipIcon />
						<ModalTooltipTypo>
							A single transaction with two messages (Redelegation + Restake update) will be broadcast.
						</ModalTooltipTypo>
					</ModalTooltipWrapper>
					<ModalTooltipWrapper>
						<ModalTooltipIcon />
						<ModalTooltipTypo>If no changes are made, clicking 'Skip' will only broadcast the redelegation.</ModalTooltipTypo>
					</ModalTooltipWrapper>

					<ButtonWrapper>
						<CancelButton onClick={goBackToRedelegate} $status={1}>
							Back
						</CancelButton>
						<NextButton onClick={onClickNext} $status={0}>
							{hasPendingChange ? 'Next' : 'Skip'}
						</NextButton>
					</ButtonWrapper>
				</ModalContent>
			</ModalContainer>
		</Modal>
	);
};

export default React.memo(RedelegateRestakeModal);
