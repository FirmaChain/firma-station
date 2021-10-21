import React from "react";
import styled from "styled-components";

import { ContentContainer } from "styles/accounts";

import { modalActions } from "redux/action";

export const NextButton = styled.div`
  width: 100px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  margin: 10px auto 0 auto;
  color: white;
  background-color: #3550de;
  border-radius: 4px;
  cursor: pointer;
`;

const Accounts = () => {
  return (
    <ContentContainer>
      <NextButton
        onClick={() => {
          modalActions.handleModalSend(true);
        }}
      >
        SEND
      </NextButton>
    </ContentContainer>
  );
};

export default React.memo(Accounts);
