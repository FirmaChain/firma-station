import React from "react";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { FIRMACHAIN_CONFIG } from "../../config";

import { rootState } from "../../redux/reducers";
import { modalActions } from "../../redux/action";
import { convertNumber, convertToFctNumber } from "../../utils/common";

import { ButtonWrapper, Button } from "./styles";

const ProposalButtons = () => {
  const { balance } = useSelector((state: rootState) => state.user);
  const { enqueueSnackbar } = useSnackbar();

  return (
    <ButtonWrapper>
      <Button
        onClick={() => {
          if (convertNumber(balance) > convertToFctNumber(FIRMACHAIN_CONFIG.defaultFee)) {
            modalActions.handleModalNewProposal(true);
          } else {
            enqueueSnackbar("Insufficient funds. Please check your account balance.", {
              variant: "error",
              autoHideDuration: 2000,
            });
          }
        }}
      >
        New proposal
      </Button>
    </ButtonWrapper>
  );
};

export default React.memo(ProposalButtons);
