import styled from "styled-components";

export const ContentContainer = styled.div`
  flex: 1;
  z-index: 2;
  width: calc(100% - 80px);
  display: flex;
  flex-direction: column;
  gap: 10px 0;
  padding: 0 40px;
  background-color: ${({ theme }) => theme.colors.backgroundBlack};
  color: ${({ theme }) => theme.colors.defaultFont};
  @media only screen and (max-width: 1400px) {
    width: calc(100% - 20px);
    padding: 0 10px;
  }
`;
