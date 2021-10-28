import React from "react";

import { SingleTitleCardStyled, SingleTitleCardContentStyled, SingleTitleTypo, SingleContentType } from "./styles";

interface IProps {
  title: string;
  content: string | number;
  background: string;
  height: string;
}

const SingleTitleCard = ({ title, content, background, height = "auto" }: IProps) => {
  return (
    <SingleTitleCardStyled $height={height} elevation={0}>
      <SingleTitleCardContentStyled $height={height} $background={background}>
        <SingleTitleTypo>{title}</SingleTitleTypo>
        <SingleContentType>{content}</SingleContentType>
      </SingleTitleCardContentStyled>
    </SingleTitleCardStyled>
  );
};

export default React.memo(SingleTitleCard);
