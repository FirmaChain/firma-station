import styled from "styled-components";

export const FooterContainer = styled.div`
  width: calc(100% - 80px);
  height: 50px;
  line-height: 50px;
  display: flex;
  justify-content: space-between;
  padding: 0 40px;
  margin-top: auto;
  background-color: ${({ theme }) => theme.colors.backgroundBlack};
  color: ${({ theme }) => theme.colors.defaultGrayFont};
`;

export const FooterTypo = styled.div`
  font-size: ${({ theme }) => theme.sizes.footerContent};
  font-weight: 400;
  height: 50px;
  line-height: 50px;
`;
