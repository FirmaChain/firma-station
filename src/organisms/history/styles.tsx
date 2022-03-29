import styled from "styled-components";

export const ListWrapper = styled.div`
  width: calc(100% - 20px);
  height: 100%;
  flex: 1;
  background-color: ${({ theme }) => theme.colors.backgroundSideBar};
  font-size: ${({ theme }) => theme.sizes.modal14};
  border-radius: 4px;
  padding: 0 10px;
  color: #afafaf;
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
    flex: 1 1 800px;
  }
  &:nth-child(3) {
    flex: 1 1 800px;
  }
  &:nth-child(5) {
    flex: 1 1 300px;
  }
  &:nth-child(6) {
    flex: 1 1 800px;
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
  &:nth-child(2) {
    display: flex;
    align-items: center;
    justify-content: center;
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

export const HistoryTypeBox = styled.div<{ baseColor: string }>`
  width: auto;
  height: 20px;
  line-height: 20px;
  padding: 5px 8px 5px 8px;
  border-radius: 4px;
  font-size: ${({ theme }) => theme.sizes.modal15};
  background-color: ${(props) => props.baseColor}35;
  color: ${(props) => props.baseColor};
`;
