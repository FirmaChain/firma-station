import React from "react";

import {
  TableStyled,
  TableBodyStyled,
  TableCellStyled,
  TableContainerStyled,
  TableHeadStyled,
  TableRowStyled,
} from "./styles";

function AessetTable({ columns, assets, size }) {
  return (
    <TableContainerStyled elevation={0}>
      <TableStyled size={size}>
        <TableHeadStyled>
          <TableRowStyled>
            {columns.map(({ name, align, width }, i) => (
              <TableCellStyled align={align} width={width} key={i}>
                {name}
              </TableCellStyled>
            ))}
          </TableRowStyled>
        </TableHeadStyled>
        <TableBodyStyled>
          {assets.map((data, i) => (
            <TableRowStyled key={i}>
              {data.map((value, j) => (
                <TableCellStyled align={columns[j].align} key={j} style={{ color: "#bbb" }}>
                  {value}
                </TableCellStyled>
              ))}
            </TableRowStyled>
          ))}
        </TableBodyStyled>
      </TableStyled>
    </TableContainerStyled>
  );
}

export default AessetTable;
