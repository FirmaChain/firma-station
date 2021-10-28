import React from "react";

import {
  TableStyled,
  TableBodyStyled,
  TableCellStyled,
  TableContainerStyled,
  TableHeadStyled,
  TableRowStyled,
} from "./styles";

interface columnItem {
  name: string;
  align?: "center" | "inherit" | "justify" | "left" | "right";
  width?: string;
}

interface IProps {
  columns: Array<columnItem>;
  assets: Array<Array<string>>;
  size?: "small" | "medium";
}

const AessetTable = ({ columns, assets, size }: IProps) => {
  return (
    <TableContainerStyled>
      <TableStyled size={size}>
        <TableHeadStyled>
          <TableRowStyled>
            {columns.map(({ name, align, width }: columnItem, i) => (
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
};

export default React.memo(AessetTable);
