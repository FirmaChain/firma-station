import styled from "styled-components";

export const BackgroundImg = styled.div`
  z-index: 1;
  width: 540px;
  height: 540px;
  position: absolute;
  top: 50%;
  left: 49%;
  transform: translate(-50%, -50%);
  opacity: 0.05;
  background-image: url("${({ theme }) => theme.urls.bgLogo}");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
`;

export const ComingTextTypo = styled.div`
  position: absolute;
  top: 50%;
  left: 58%;
  transform: translate(-50%, -50%);
  text-align: center;
  font-size: ${({ theme }) => theme.sizes.comingTitle};
`;
