import React from 'react';
import { useSnackbar } from 'notistack';
import { useSelector } from 'react-redux';

import { CHAIN_CONFIG } from '../../../config';
import { PROPOSAL_STATUS_DEPOSIT_PERIOD } from '../../../constants/governance';
import { IProposalDetailState } from '../../../interfaces/governance';
import { modalActions } from '../../../redux/action';
import { rootState } from '../../../redux/reducers';
import { convertNumber, convertNumberFormat, convertToFctNumber, getDefaultFee } from '../../../utils/common';
import { getDateTimeFormat } from '../../../utils/dateUtil';
import dayjs from '../../../utils/dayjs';
import { CardWrapper, DepositButton, DepositContent, DepositDetailItem, DepositDetailWrapper, DepositMainTitle, Label } from './styles';

interface IProps {
	proposalState: IProposalDetailState;
}

const DepositCard = ({ proposalState }: IProps) => {
	const { balance } = useSelector((state: rootState) => state.user);
	const { isLedger, isMobileApp } = useSelector((state: rootState) => state.wallet);
	const { enqueueSnackbar } = useSnackbar();

	const getAddTimeFormat = (startTime: string, second: number) => {
		return getDateTimeFormat(dayjs.utc(startTime).add(convertNumber(second), 'seconds').toISOString());
	};

	//! Deprecated: Sum logic is not correct
	// const getCurrentDeposit_deprecated = (deposits: any) => {
	//   if (deposits === undefined) return 0;

	//   let totalDeposit = 0;
	//   for (let value of deposits) {
	//     totalDeposit += convertNumber(value.amount[0].amount);
	//   }

	//   return totalDeposit;
	// };

	const getCurrentDeposit = (deposits: any) => {
		if (deposits === undefined) return 0;

		// Save the latest values by wallet address based on timestamp
		const latestDepositsByAddress = new Map();

		// Compare timestamps to keep only the latest deposit per wallet
		for (const deposit of deposits) {
			const existingDeposit = latestDepositsByAddress.get(deposit.depositor_address);

			if (!existingDeposit || new Date(deposit.timestamp) > new Date(existingDeposit.timestamp)) {
				latestDepositsByAddress.set(deposit.depositor_address, deposit);
			}
		}

		// Sum the latest values of each wallet
		let totalDeposit = 0;
		for (const [address, deposit] of latestDepositsByAddress) {
			totalDeposit += convertNumber(deposit.amount[0].amount);
		}

		return totalDeposit;
	};

	const getAmountFormat = (amount: number) => {
		return `${convertNumberFormat(convertToFctNumber(amount), 2)} ${CHAIN_CONFIG.PARAMS.SYMBOL}`;
	};

	return (
		<CardWrapper>
			<DepositMainTitle>Deposit</DepositMainTitle>
			<DepositDetailWrapper>
				<DepositDetailItem>
					<Label>Deposit Period</Label>
					<DepositContent>{getAddTimeFormat(proposalState.submitTime, proposalState.periodDeposit)}</DepositContent>
				</DepositDetailItem>
				<DepositDetailItem>
					<Label>Min Deposit Amount</Label>
					<DepositContent $bigSize={true}>{getAmountFormat(proposalState.paramMinDepositAmount)}</DepositContent>
				</DepositDetailItem>
				<DepositDetailItem>
					<Label>Current Deposit</Label>
					<DepositContent $bigSize={true}>{getAmountFormat(getCurrentDeposit(proposalState.depositors))}</DepositContent>
				</DepositDetailItem>
			</DepositDetailWrapper>
			{proposalState.status === PROPOSAL_STATUS_DEPOSIT_PERIOD && (
				<DepositButton
					$active={true}
					onClick={() => {
						if (convertNumber(balance) > convertToFctNumber(getDefaultFee(isLedger, isMobileApp))) {
							modalActions.handleModalData({
								proposalId: proposalState.proposalId
							});
							modalActions.handleModalDeposit(true);
						} else {
							enqueueSnackbar('Insufficient funds. Please check your account balance.', {
								variant: 'error',
								autoHideDuration: 2000
							});
						}
					}}
				>
					Deposit
				</DepositButton>
			)}
		</CardWrapper>
	);
};

export default React.memo(DepositCard);
