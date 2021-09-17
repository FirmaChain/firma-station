import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import theme from "../../theme";

function AessetTable({ columns, assets, size }) {
  const useStyles = makeStyles({
    root: {
      backgroundColor: theme.colors.backgroundSideBar,
      boxShadow: 0,
      "& *": {
        color: "#aaa",
        borderBottom: "1px solid #34353C",
      },
    },
  });

  const classes = useStyles();

  return (
    <TableContainer component={Paper} className={classes.root} elevation={0}>
      <Table size={size} className={classes.root}>
        <TableHead>
          <TableRow>
            {columns.map(({ name, align, width }, i) => (
              <TableCell align={align} width={width} key={i}>
                {name}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {assets.map((data, i) => (
            <TableRow key={i}>
              {data.map((value, j) => (
                <TableCell align={columns[j].align} key={j} style={{ color: "#bbb" }}>
                  {value}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default AessetTable;
