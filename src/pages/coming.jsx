import React from "react";
import styled from "styled-components";
import { Typography } from "@material-ui/core";

const ContentContainer = styled.div`
  width: 100%;
  padding: 0 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100% - 130px);
  background-color: ${({ theme }) => theme.colors.backgroundBlack};
  color: ${({ theme }) => theme.colors.defaultFont};
`;

const BackgroundImg = styled.div`
  z-index: 1;
  width: 540px;
  height: 540px;
  position: absolute;
  top: 50%;
  left: 49%;
  transform: translate(-50%, -50%);
  opacity: 0.05;
  background-image: url("/images/bgLogo.png");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
`;

function Coming() {
  return (
    <ContentContainer>
      <Typography variant="h3" align="center">
        Under Development
        <BackgroundImg />
      </Typography>
    </ContentContainer>
  );
}

export default React.memo(Coming);
