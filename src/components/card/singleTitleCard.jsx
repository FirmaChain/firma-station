import React from "react";

import { SingleTitleCardStyled, SingleTitleCardContentStyled, SingleTitleTypo, SingleContentType } from "./styles";

function SingleTitleCard({ title, content, background, height = "auto" }) {
  return (
    <SingleTitleCardStyled $height={height} elevation={0}>
      <SingleTitleCardContentStyled $height={height} $background={background}>
        <SingleTitleTypo>{title}</SingleTitleTypo>
        <SingleContentType>{content}</SingleContentType>
      </SingleTitleCardContentStyled>
    </SingleTitleCardStyled>
  );
}

export default SingleTitleCard;
