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
  align-items: center;
  background-color: ${({ theme }) => theme.colors.backgroundBlack};
`;
