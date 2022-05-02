import React from "react";
import moment from "moment";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";

import { rootState } from "../../../redux/reducers";
import { convertNumber, convertToFctNumber, convertNumberFormat } from "../../../utils/common";
import { PROPOSAL_STATUS_DEPOSIT_PERIOD } from "../../../constants/government";
import { IProposalState } from "../hooks";
import { modalActions } from "../../../redux/action";

import {
  CardWrapper,
  DepositDetailWrapper,
  DepositDetailItem,
  Label,
  DepositContent,
  DepositMainTitle,
  DepositButton,
} from "./styles";
import { FIRMACHAIN_CONFIG } from "../../../config";

interface IProps {
  proposalState: IProposalState;
}

const DepositCard = ({ proposalState }: IProps) => {
  const { balance } = useSelector((state: rootState) => state.user);
  const { enqueueSnackbar } = useSnackbar();

  const getAddTimeFormat = (startTime: string, second: number) => {
    return moment(startTime).add(convertNumber(second), "seconds").format("YYYY-MM-DD HH:mm:ss+00:00");
  };

  const getCurrentDeposit = (deposits: any) => {
    if (deposits === undefined) return 0;

    let totalDeposit = 0;
    for (let value of deposits) {
      totalDeposit += convertNumber(value.amount[0].amount);
    }

    return totalDeposit;
  };

  const getAmountFormat = (amount: number) => {
    return `${convertNumberFormat(convertToFctNumber(amount), 2)} FCT`;
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
            if (convertNumber(balance) > convertToFctNumber(FIRMACHAIN_CONFIG.defaultFee)) {
              modalActions.handleModalData({
                proposalId: proposalState.proposalId,
              });
              modalActions.handleModalDeposit(true);
            } else {
              enqueueSnackbar("Insufficient funds. Please check your account balance.", {
                variant: "error",
                autoHideDuration: 2000,
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
