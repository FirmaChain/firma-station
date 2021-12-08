import styled from "styled-components";

export const ListWrapper = styled.div`
  width: 100%;
  height: 100%;
  flex: 1;
`;

export const RowWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: nowrap;
`;

export const Column = styled.div`
  width: 100%;
  & {
    flex: 1 1 100%;
    text-align: center;
  }
  &:nth-child(1) {
    flex: 1 1 300px;
  }
  &:nth-child(2) {
    flex: 1 1 500px;
  }
  &:nth-child(4) {
    flex: 1 1 300px;
  }
  &:nth-child(5) {
    flex: 1 1 400px;
  }
`;

export const ItemWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: nowrap;
  border-bottom: 1px solid #444;
`;

export const ItemColumn = styled(Column)`
  height: 50px;
  line-height: 50px;
  & > a {
    text-decoration: none !important;
  }
  & > a:hover {
    background: none;
  }
`;

export const HeaderWrapper = styled(RowWrapper)`
  height: 50px;
  line-height: 50px;
  border-bottom: 1px solid #444;
`;

export const HeaderColumn = styled(Column)`
  color: #ddd;
`;
