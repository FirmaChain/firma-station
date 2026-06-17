import React from 'react';
import { useSnackbar } from 'notistack';

import { CHAIN_CONFIG } from '../../../config';
import { IGrantsDataState, ITargetStakingState } from '../../../interfaces/staking';
import { modalActions, useAvatarStore, useUserStore, useWalletStore } from '../../../store';
import { convertNumber, convertNumberFormat, convertToFctNumber, getDefaultFee, getFeesFromGas } from '../../../utils/common';
import useFirma from '../../../utils/wallet';
import { Button, Buttons, CardWrapper, Content, InnerWrapper, Title } from './styles';

interface IProps {
	targetStakingState: ITargetStakingState;
	grantDataState: IGrantsDataState;
}

const DelegationCard = ({ targetStakingState, grantDataState }: IProps) => {
	const targetValidator = window.location.pathname.replace('/staking/validators/', '');
	const { balance } = useUserStore((state) => state);
	const { isLedger, isMobileApp } = useWalletStore((state) => state);
	const { avatarList } = useAvatarStore((state) => state);
	const { getDelegationList, getDelegation, withdraw, getGasEstimationWithdraw, getUndelegationList } = useFirma();

	const { enqueueSnackbar } = useSnackbar();

	const delegateAction = () => {
		if (targetStakingState.available > convertToFctNumber(getDefaultFee(isLedger, isMobileApp))) {
			modalActions.handleModalData({
				action: 'Delegate',
				data: { targetValidator, available: targetStakingState.available, reward: targetStakingState.stakingReward }
			});

			modalActions.handleModalDelegate(true);
		} else {
			enqueueSnackbar('Insufficient funds. Please check your account balance.', {
				variant: 'error',
				autoHideDuration: 2000
			});
		}
	};

	const redelegateAction = () => {
		getDelegationList()
			.then((delegationList) => {
				const options = (delegationList || [])
					.filter((d) => d.validatorAddress !== targetValidator)
					.map((d) => ({
						value: d.validatorAddress,
						label: getMoniker(d.validatorAddress),
						amount: d.amount
					}));

				if (options.length === 0) {
					enqueueSnackbar('There is no target that has been delegated', {
						variant: 'error',
						autoHideDuration: 2000
					});
					return;
				}

				if (targetStakingState.available >= convertToFctNumber(getDefaultFee(isLedger, isMobileApp) + 5000)) {
					modalActions.handleModalData({
						action: 'Redelegate',
						data: {
							targetValidator,
							targetValidatorMoniker: getMoniker(targetValidator),
							delegationList: options,
							allowValidatorList: grantDataState.allowValidatorList.map((v) => v.operatorAddress)
						}
					});

					modalActions.handleModalRedelegate(true);
				} else {
					enqueueSnackbar('Insufficient funds. Please check your account balance.', {
						variant: 'error',
						autoHideDuration: 2000
					});
				}
			})
			.catch(() => {});
	};

	const getMoniker = (validatorAddress: string) => {
		let moniker = validatorAddress;

		const avatar = avatarList.find((avatar) => avatar.operatorAddress === validatorAddress);
		if (avatar) {
			moniker = avatar.moniker;
		}

		return moniker;
	};

	const undelegateAction = () => {
		getUndelegationList()
			.then((undelegationList) => {
				if (undelegationList.filter((v) => v.validatorAddress === targetValidator).length >= 7) {
					enqueueSnackbar('You cannot undelegate more than 7 times per validator!', {
						variant: 'error',
						autoHideDuration: 2000
					});
					return;
				}
				getDelegation(targetValidator)
					.then((delegation) => {
						if (delegation === undefined) {
							enqueueSnackbar('There is no target that has been delegated', {
								variant: 'error',
								autoHideDuration: 2000
							});
							return;
						}

						if (targetStakingState.available >= convertToFctNumber(getDefaultFee(isLedger, isMobileApp))) {
							modalActions.handleModalData({
								action: 'Undelegate',
								data: { targetValidator, delegation }
							});

							modalActions.handleModalUndelegate(true);
						} else {
							enqueueSnackbar('Insufficient funds. Please check your account balance.', {
								variant: 'error',
								autoHideDuration: 2000
							});
						}
					})
					.catch((e) => {});
			})
			.catch((e) => {});
	};

	const getParamsTx = () => {
		return {
			validatorAddress: targetValidator
		};
	};

	const withdrawAction = () => {
		getGasEstimationWithdraw(targetValidator)
			.then((gas) => {
				if (convertNumber(balance) >= convertToFctNumber(getFeesFromGas(gas, isLedger))) {
					modalActions.handleModalData({
						action: 'Withdraw',
						module: '/distribution/withdraw',
						data: { amount: targetStakingState.stakingReward, fees: getFeesFromGas(gas, isLedger), gas },
						txAction: withdrawTx,
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

	const withdrawTx = (resolveTx: () => void, rejectTx: () => void, gas = 0) => {
		withdraw(targetValidator, gas)
			.then(() => {
				resolveTx();
			})
			.catch(() => {
				rejectTx();
			});
	};

	return (
		<CardWrapper>
			<InnerWrapper>
				<Title>My Delegations</Title>
				<Content>{`${convertNumberFormat(targetStakingState.delegated, 3)} ${CHAIN_CONFIG.PARAMS.SYMBOL}`}</Content>
				<Buttons>
					<Button onClick={delegateAction} $isActive={true}>
						Delegate
					</Button>
					<Button onClick={redelegateAction} $isActive={true}>
						Redelegate
					</Button>
					<Button
						onClick={() => {
							if (targetStakingState.delegated > 0) undelegateAction();
						}}
						$isActive={targetStakingState.delegated > 0}
					>
						Undelegate
					</Button>
				</Buttons>
			</InnerWrapper>
			<InnerWrapper>
				<Title>Rewards</Title>
				<Content>{`${convertNumberFormat(targetStakingState.stakingReward, 3)} ${CHAIN_CONFIG.PARAMS.SYMBOL}`}</Content>
				<Buttons>
					<Button
						onClick={() => {
							if (targetStakingState.stakingReward > 0) withdrawAction();
						}}
						$isActive={targetStakingState.stakingReward > 0}
					>
						Withdraw
					</Button>
				</Buttons>
			</InnerWrapper>
		</CardWrapper>
	);
};

export default React.memo(DelegationCard);
