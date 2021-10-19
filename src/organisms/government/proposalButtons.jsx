import React from "react";
import styled from "styled-components";

import { modalActions } from "redux/action";

const ListWrapper = styled.div`
  width: 100%;
  height: 50px;
`;

const Button = styled.div`
  width: 140px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  color: white;
  background-color: #3550de;
  border-radius: 4px;
  cursor: pointer;
`;

const ProposalButtons = () => {
  return (
    <ListWrapper>
      <Button onClick={() => modalActions.handleModalNewProposal(true)}>New Proposal</Button>
    </ListWrapper>
  );
};

export default ProposalButtons;
