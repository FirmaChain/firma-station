import React from "react";

import theme from "themes";
import { BlankCard } from "components/card";
import { TitleTypo, NextButton } from "./styles";
import { modalActions } from "redux/action";

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
