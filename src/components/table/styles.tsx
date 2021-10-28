import styled from "styled-components";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

export const TableContainerStyled = styled(TableContainer)`
  background-color: ${({ theme }) => theme.colors.backgroundSideBar} !important;
  box-shadow: 0 !important;
  & * {
    color: ${({ theme }) => theme.colors.defaultDarkGray} !important;
    border-bottom: 1px solid ${({ theme }) => theme.colors.borderLine} !important;
  }
`;

export const TableStyled = styled(Table)``;

export const TableBodyStyled = styled(TableBody)``;

export const TableCellStyled = styled(TableCell)``;

export const TableHeadStyled = styled(TableHead)``;

export const TableRowStyled = styled(TableRow)``;
