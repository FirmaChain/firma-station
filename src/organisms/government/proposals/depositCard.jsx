import React from "react";
import moment from "moment";
import numeral from "numeral";

import {
  CardWrapper,
  DepositDetailWrapper,
  DepositDetailItem,
  Label,
  DepositContent,
  DepositMainTitle,
  DepositButton,
} from "./styles";
import { PROPOSAL_STATUS_DEPOSIT_PERIOD } from "constants/government";
import { modalActions } from "redux/action";

const DepositCard = ({ proposalState }) => {
  const getAddTimeFormat = (startTime, second) => {
    return moment(startTime).add(numeral(second).value(), "seconds").format("YYYY-MM-DD HH:mm:ss");
  };

  const getCurrentDeposit = (deposits) => {
    if (deposits === undefined) return 0;

    let totalDeposit = 0;
    for (let value of deposits) totalDeposit += numeral(value.amount[0].amount).value();

    return totalDeposit;
  };

  const getAmountFormat = (amount) => {
    return `${numeral(amount / 1000000).format("0.00")} FCT`;
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
            modalActions.handleModalData({
              proposalId: proposalState.proposalId,
            });
            modalActions.handleModalDeposit(true);
          }}
        >
          Deposit
        </DepositButton>
      )}
    </CardWrapper>
  );
};

export default DepositCard;
