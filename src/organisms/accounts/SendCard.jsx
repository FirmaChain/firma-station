import React from "react";
import styled from "styled-components";
import theme from "themes";
import { BlankCard } from "components/card";
import { modalActions } from "redux/action";

const TitleTypo = styled.div`
  color: ${({ theme }) => theme.colors.realWhite};
  height: 30px;
  line-height: 30px;
  font-size: ${({ theme }) => theme.sizes.accountCardSize1};
  margin-right: 6px;
  margin-bottom: 10px;
`;

export const NextButton = styled.div`
  width: 300px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  color: white;
  background-color: #3550de;
  border-radius: 4px;
  cursor: pointer;
`;

const SendCard = () => {
  return (
    <BlankCard bgColor={theme.colors.backgroundSideBar} height="100%">
      <TitleTypo>SEND</TitleTypo>
      <NextButton
        onClick={() => {
          modalActions.handleModalSend(true);
        }}
      >
        SEND to Address
      </NextButton>
    </BlankCard>
  );
};

export default SendCard;
