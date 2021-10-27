import React from "react";

import { ButtonWrapper, Button } from "./styles";
import { modalActions } from "redux/action";

const ProposalButtons = () => {
  return (
    <ButtonWrapper>
      <Button onClick={() => modalActions.handleModalNewProposal(true)}>New Proposal</Button>
    </ButtonWrapper>
  );
};

export default ProposalButtons;
