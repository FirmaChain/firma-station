import React from "react";

import { modalActions } from "../../redux/action";

import theme from "../../themes";
import { BlankCard } from "../../components/card";
import { TitleTypo, NextButton } from "./styles";

const SendCard = () => {
  return (
    <BlankCard bgColor={theme.colors.backgroundSideBar} height="100%">
      <TitleTypo>SEND</TitleTypo>
      <NextButton
        onClick={() => {
          modalActions.handleModalSend(true);
        }}
      >
        send to address
      </NextButton>
    </BlankCard>
  );
};

export default React.memo(SendCard);
