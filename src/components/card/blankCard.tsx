import React from "react";

import { BlankCardStyled, BlankCardContentStyled, LogoBG } from "./styles";

interface IProps {
  backgroundLogo?: boolean;
  bgColor: string;
  height?: string;
  children: React.ReactNode;
}

const BlankCard = ({ backgroundLogo = false, bgColor, height = "auto", children }: IProps) => {
  return (
    <BlankCardStyled $bgColor={bgColor} $height={height}>
      <BlankCardContentStyled>{children}</BlankCardContentStyled>
      {backgroundLogo && <LogoBG />}
    </BlankCardStyled>
  );
};

export default React.memo(BlankCard);
