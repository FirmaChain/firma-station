import React from "react";

import { BlankCardStyled, BlankCardContentStyled, LogoBG } from "./styles";

const BlankCard = ({ backgroundLogo = false, bgColor, height = "auto", children }) => {
  return (
    <BlankCardStyled $bgColor={bgColor} $height={height}>
      <BlankCardContentStyled>{children}</BlankCardContentStyled>
      {backgroundLogo && <LogoBG />}
    </BlankCardStyled>
  );
};

export default BlankCard;
