import React from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';

import { rootState } from '../../../redux/reducers';
import { convertNumber, convertToFctNumber, convertNumberFormat, getDefaultFee } from '../../../utils/common';
import { PROPOSAL_STATUS_DEPOSIT_PERIOD } from '../../../constants/government';
import { IProposalDetailState } from '../../../interfaces/governance';
import { modalActions } from '../../../redux/action';

import {
  CardWrapper,
  DepositDetailWrapper,
  DepositDetailItem,
  Label,
  DepositContent,
  DepositMainTitle,
  DepositButton
} from './styles';
import { CHAIN_CONFIG } from '../../../config';
import { getDateTimeFormat } from '../../../utils/dateUtil';

interface IProps {
  proposalState: IProposalDetailState;
}

const DepositCard = ({ proposalState }: IProps) => {
  const { balance } = useSelector((state: rootState) => state.user);
  const { isLedger, isMobileApp } = useSelector((state: rootState) => state.wallet);
  const { enqueueSnackbar } = useSnackbar();

  const getAddTimeFormat = (startTime: string, second: number) => {
    return getDateTimeFormat(moment.utc(startTime).add(convertNumber(second), 'seconds').toISOString());
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
    for (let deposit of deposits) {
      const existingDeposit = latestDepositsByAddress.get(deposit.depositor_address);

      if (!existingDeposit || new Date(deposit.timestamp) > new Date(existingDeposit.timestamp)) {
        latestDepositsByAddress.set(deposit.depositor_address, deposit);
      }
    }

    // Sum the latest values of each wallet
    let totalDeposit = 0;
    for (let [address, deposit] of latestDepositsByAddress) {
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
          <DepositContent bigSize={true}>{getAmountFormat(proposalState.paramMinDepositAmount)}</DepositContent>
        </DepositDetailItem>
        <DepositDetailItem>
          <Label>Current Deposit</Label>
          <DepositContent bigSize={true}>{getAmountFormat(getCurrentDeposit(proposalState.depositors))}</DepositContent>
        </DepositDetailItem>
      </DepositDetailWrapper>
      {proposalState.status === PROPOSAL_STATUS_DEPOSIT_PERIOD && (
        <DepositButton
          active={true}
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
