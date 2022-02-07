import styled from "styled-components";

export const FooterContainer = styled.div`
  width: calc(100% - 80px);
  height: 80px;
  line-height: 50px;
  display: flex;
  justify-content: space-between;
  padding: 0 40px;
  margin-top: auto;
  background-color: ${({ theme }) => theme.colors.backgroundBlack};
  color: ${({ theme }) => theme.colors.defaultGrayFont};
  @media only screen and (max-width: 1400px) {
    width: calc(100% - 20px);
    padding: 0 10px;
  }
`;

export const FooterTypo = styled.div`
  font-size: ${({ theme }) => theme.sizes.footerContent};
  font-weight: 400;
  height: 50px;
  line-height: 50px;
`;
