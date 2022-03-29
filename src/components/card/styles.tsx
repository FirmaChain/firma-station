import styled from "styled-components";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

export const LogoBG = styled.div`
  width: 260px;
  height: 260px;
  position: absolute;
  top: -60px;
  right: -110px;
  background-image: url("${({ theme }) => theme.urls.logo}");
  background-repeat: no-repeat;
  background-size: contain;
  bakcground-position: center center;
  opacity: 0.07;
`;

export const BlankCardStyled = styled(Card)<{ $height: string; $bgColor: string }>`
  width: 100%;
  position: relative;
  box-shadow: none !important;
  & > * {
    box-shadow: none !important;
  }

  ${(props) => props.$height && `height:${props.$height};min-height:${props.$height};max-height:${props.$height};`}
  background-color:${(props) => props.$bgColor} !important;
`;

export const BlankCardContentStyled = styled(CardContent)`
  height: calc(100% - 30px);
  padding: 15px;
  color: ${({ theme }) => theme.colors.defaultWhite};
`;

export const SingleTitleCardStyled = styled(Card)<{ $height: string }>`
  flex: 1;
  border: 0;
  width: 100%;
  position: relative;
  height: ${(props) => props.$height};
  background-color: transparent !important;
  box-shadow: none !important;
  & > * {
    box-shadow: none !important;
  }
`;

export const SingleTitleCardContentStyled = styled(CardContent)<{ $height: string; $background: string }>`
  color: ${({ theme }) => theme.colors.defaultFont};
  height: calc(${(props) => props.$height} - 40px);
  background: ${(props) => props.$background};
  padding-left: 30px !important;
`;

export const SingleTitleTypo = styled.div`
  color: ${({ theme }) => theme.colors.defaultDarkGray};
  font-size: ${({ theme }) => theme.sizes.accountCardSize1};
  padding-top: 22px;
`;

export const SingleContentType = styled.div`
  margin-top: 12px;
  font-size: ${({ theme }) => theme.sizes.singleCardContent};
`;
