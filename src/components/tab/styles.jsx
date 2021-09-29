import styled from "styled-components";
import Paper from "@mui/material/Paper";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

export const PaperStyled = styled(Paper)`
  margin-bottom: 10px;
  flex-grow: 1;
  background-color: ${({ theme }) => theme.colors.backgroundSideBar} !important;
  & * {
    color: ${({ theme }) => theme.colors.defaultDarkGray} !important;
  }
`;

export const TabsStyled = styled(Tabs)`
  & .MuiTabs-indicator {
    background: ${({ theme }) => theme.colors.mainblue} !important;
  }
`;

export const TabStyled = styled(Tab)``;
