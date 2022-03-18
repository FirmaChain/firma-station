import React from "react";

import { ToggleWrapper, ToggleText, ToggleButtonImage } from "./styles";

interface IProps {
  toggleText: string;
  isActive: Boolean;
  onClickToggle: Function;
}

const ToggleButton = ({ toggleText, isActive, onClickToggle }: IProps) => {
  const onClick = () => {
    onClickToggle();
  };

  return (
    <ToggleWrapper>
      <ToggleText>{toggleText}</ToggleText>
      <ToggleButtonImage isActive={isActive} onClick={onClick}></ToggleButtonImage>
    </ToggleWrapper>
  );
};

export default React.memo(ToggleButton);
