import React from "react";

import { BlankCardStyled, BlankCardContentStyled, LogoBG } from "./styles";

function BlankCard({ backgroundLogo = false, bgColor, height = "auto", children }) {
  return (
    <BlankCardStyled $bgColor={bgColor} $height={height}>
      <BlankCardContentStyled>{children}</BlankCardContentStyled>
      {backgroundLogo && <LogoBG />}
    </BlankCardStyled>
  );
}

export default BlankCard;
