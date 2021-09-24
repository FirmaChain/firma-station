import styled from "styled-components";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

export const PaperStyled = styled(Paper)`
  margin-bottom: 10px;
  flex-grow: 1;
  background-color: ${({ theme }) => theme.colors.backgroundSideBar} !important;
  & * {
    color: ${({ theme }) => theme.colors.defaultDarkGray};
  }
`;

export const TabsStyled = styled(Tabs)`
  & .MuiTabs-indicator {
    background: ${({ theme }) => theme.colors.mainblue} !important;
  }
`;

export const TabStyled = styled(Tab)``;
