import styled from "styled-components";

export const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 5px;
`;

export const ToggleText = styled.div`
  height: 24px;
  line-height: 24px;
`;
export const ToggleButtonImage = styled.div<{ isActive: Boolean }>`
  width: 44px;
  height: 24px;
  display: flex;
  background-image: url("${(props) => (props.isActive ? props.theme.urls.on : props.theme.urls.off)}");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  cursor: pointer;
`;
