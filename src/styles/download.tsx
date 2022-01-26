import styled from "styled-components";

export const ContentContainer = styled.div`
  z-index: 2;
  width: calc(100% - 80px);
  height: 100%;
  padding: 0 40px;
  background-color: ${({ theme }) => theme.colors.backgroundBlack};
  color: ${({ theme }) => theme.colors.defaultFont};
`;
