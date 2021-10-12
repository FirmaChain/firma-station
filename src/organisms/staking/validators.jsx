import React from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List } from "react-window";
import styled from "styled-components";

const RowWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: nowrap;
`;

const Column = styled.div`
  width: 100%;
  & {
    flex: 1 1 100%;
  }
  &:nth-child(1) {
    text-align: center;
    flex: 1 1 200px;
  }
  &:nth-child(3),
  &:nth-child(4),
  &:nth-child(5),
  &:nth-child(6) {
    text-align: center;
    flex: 1 1 300px;
  }
`;

const ItemWrapper = styled(RowWrapper)`
  height: 50px;
  line-height: 50px;
  border-bottom: 1px solid #444;
`;

const ItemColumn = styled(Column)``;

const HeaderWrapper = styled(RowWrapper)`
  height: 70px;
  line-height: 70px;
  border-bottom: 1px solid #444;
`;

const HeaderColumn = styled(Column)`
  color: #ddd;
`;

const ListWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const Row = ({ index, style }) => {
  return (
    <ItemWrapper style={style}>
      <ItemColumn>{index}</ItemColumn>
      <ItemColumn>firma-node-1</ItemColumn>
      <ItemColumn>30%</ItemColumn>
      <ItemColumn>100%</ItemColumn>
      <ItemColumn>10%</ItemColumn>
      <ItemColumn>100%</ItemColumn>
    </ItemWrapper>
  );
};

const Validators = () => {
  return (
    <ListWrapper>
      <AutoSizer>
        {({ height, width }) => (
          <>
            <HeaderWrapper style={{ width }}>
              <HeaderColumn>No</HeaderColumn>
              <HeaderColumn>Moniker</HeaderColumn>
              <HeaderColumn>Voting Power</HeaderColumn>
              <HeaderColumn>Self Delegation</HeaderColumn>
              <HeaderColumn>Validator Commission</HeaderColumn>
              <HeaderColumn>UpTime</HeaderColumn>
            </HeaderWrapper>
            <List width={width} height={height - 70} itemCount={10} itemSize={50}>
              {Row}
            </List>
          </>
        )}
      </AutoSizer>
    </ListWrapper>
  );
};

export default Validators;
