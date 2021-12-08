import styled from "styled-components";

export const MainContainer = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  display: flex;
`;

export const RightContainer = styled.div`
  width: 100%;
  height: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  & > div {
  }
  & > div:nth-child(1) {
    height: 80px;
  }
  & > div:nth-child(2) {
    flex: 1;
  }
  & > div:nth-child(3) {
    height: 50px;
  }
`;
