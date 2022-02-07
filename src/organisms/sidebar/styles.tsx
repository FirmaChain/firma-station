import styled from "styled-components";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

export const DrawerStyled = styled(Drawer)`
  & .MuiDrawer-paper {
    border: 0;
    margin: 0;
    padding: 0;
    display: flex;
    background: ${({ theme }) => theme.colors.backgroundSideBar};
    color: ${({ theme }) => theme.colors.defaultWhite};
    width: ${({ theme }) => theme.sizes.sideMenuDrawer};
  }
  width: ${({ theme }) => theme.sizes.sideMenuDrawer};
  @media only screen and (max-width: 1400px) {
    display: none;
  }
`;

export const ListStyled = styled(List)``;

export const ListItemStyled = styled(ListItem)<{
  button?: any;
  component?: any;
  to?: string;
  $isSelected?: boolean;
  $isExternalLink?: boolean;
}>`
  ${(props) =>
    props.$isSelected &&
    `
    background: ${props.theme.colors.defaultGray}25 !important;
    border-right: 4px solid ${props.theme.colors.mainblue} !important;
    * {
      color: ${props.theme.colors.realWhite} !important;
    }
    `}
  ${(props) => props.$isExternalLink && `cursor:pointer;`}
`;

export const ListItemIconStyled = styled(ListItemIcon)`
  color: ${({ theme }) => theme.colors.defaultGray} !important;
  & > svg {
    font-size: ${({ theme }) => theme.sizes.sideMenuIcon};
  }
`;

export const ListItemTextStyled = styled(ListItemText)`
  margin-top: 7px !important;

  & > span {
    font-size: ${({ theme }) => theme.sizes.singleCardTitle};
    color: ${({ theme }) => theme.colors.defaultDarkGray};
  }
`;

export const LogoImg = styled.div`
  height: 80px;
  margin: 0 20px;
  background-image: url("${({ theme }) => theme.urls.fullLogo}");
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center center;
`;

export const BottomWrap = styled.div`
  height: 30px;
  line-height: 48px;
  padding: 8px 16px;
  margin-top: auto;
`;

export const BottomIcon = styled.div`
  float: left;
  height: 100%;
  margin-right: 30px;
  color: ${({ theme }) => theme.colors.defaultGray};
`;

export const BottomMenuTypo = styled.div`
  height: 100%;
  line-height: 35px;
  float: left;
  color: ${({ theme }) => theme.colors.defaultDarkGray};
`;
