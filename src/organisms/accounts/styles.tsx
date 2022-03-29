import styled from "styled-components";
import FileCopyIcon from "@mui/icons-material/FileCopy";

export const AddressTitleTypo = styled.div`
  color: ${({ theme }) => theme.colors.realWhite};
  height: 30px;
  line-height: 30px;
  font-size: ${({ theme }) => theme.sizes.accountCardSize1};
  margin-right: 6px;
  float: left;
`;

export const UserAddressTypo = styled.div`
  width: 50%;
  height: 30px;
  line-height: 30px;
  font-size: ${({ theme }) => theme.sizes.accountCardSize2};
  color: ${({ theme }) => theme.colors.defaultGray2};
  float: left;
`;

export const UsdTypo = styled.div`
  width: 50%;
  margin-top: 8px;
  font-size: ${({ theme }) => theme.sizes.accountCardSize2};
  color: ${({ theme }) => theme.colors.defaultGray2};
  float: right;
  text-align: right;
`;

export const PriceTypo = styled.div`
  width: 100%;
  margin-top: 30px;
  font-size: ${({ theme }) => theme.sizes.accountCardSize2};
  color: ${({ theme }) => theme.colors.defaultGray2};
  float: left;
  text-align: left;
`;

export const UserBalanceTypo = styled.div`
  height: 20px;
  line-height: 20px;
  margin-top: 8px;
  width: 100%;
  font-size: ${({ theme }) => theme.sizes.accountCardSize1};
  float: left;
  text-align: left;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.realWhite};
`;

export const CopyIconImg = styled(FileCopyIcon)`
  margin-top: 5px;
  width: 18px !important;
  height: 18px !important;
  float: left;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.realWhite};
`;

export const TitleTypo = styled.div`
  color: ${({ theme }) => theme.colors.realWhite};
  height: 30px;
  line-height: 30px;
  font-size: ${({ theme }) => theme.sizes.accountCardSize1};
  margin-right: 6px;
  margin-bottom: 10px;
`;

export const NextButton = styled.div`
  width: 300px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  color: white;
  font-size: ${({ theme }) => theme.sizes.defaultSize};
  background-color: ${({ theme }) => theme.colors.mainblue};
  border-radius: 4px;
  cursor: pointer;
`;

export const ListWrapper = styled.div`
  width: 100%;
  height: 100%;
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
    flex: 1 1 400px;
  }
  &:nth-child(2) {
    flex: 1 1 400px;
  }
  &:nth-child(3) {
    flex: 1 1 400px;
  }
  &:nth-child(4) {
    flex: 1 1 800px;
  }
  &:nth-child(5) {
    flex: 1 1 300px;
  }
  &:nth-child(7) {
    flex: 1 1 500px;
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
  white-space: pre-line;

  font-size: ${({ theme }) => theme.sizes.accountCardSize4};
  color: ${({ theme }) => theme.colors.defaultFont};
  & > a {
    font-weight: 400 !important;
    text-decoration: none !important;
  }
  & > a:hover {
    background: none;
    font-weight: 500 !important;
  }

  &:nth-child(7) {
    line-height: 25px;
    font-size: ${({ theme }) => theme.sizes.accountCardSize5};
  }
`;

export const QrImage = styled.img`
  width: 16px;
  height: 16px;
  float: left;
  margin-top: 6px;
  margin-left: 5px;
  cursor: pointer;
  background-image: url("${({ theme }) => theme.urls.qr}");
  background-size: contain;
`;

export const HeaderWrapper = styled(RowWrapper)`
  height: 35px;
  line-height: 35px;
  border-bottom: 1px solid #444;
`;

export const HeaderColumn = styled(Column)`
  color: ${({ theme }) => theme.colors.defaultGray3};
  font-size: ${({ theme }) => theme.sizes.defaultSize};
`;

export const ListWrapper2 = styled.div`
  width: 100%;
  height: 100%;
  color: ${({ theme }) => theme.colors.defaultFont};
`;

export const RowWrapper2 = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: nowrap;
`;

export const Column2 = styled.div`
  width: 100%;
  & {
    flex: 1 1 100%;
    text-align: center;
  }
`;

export const HeaderWrapper2 = styled(RowWrapper2)`
  height: 50px;
  line-height: 50px;
  border-bottom: 1px solid #444;
`;

export const HeaderColumn2 = styled(Column2)`
  color: ${({ theme }) => theme.colors.defaultGray3};
  font-size: ${({ theme }) => theme.sizes.defaultSize};
`;

export const ItemWrapper2 = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: nowrap;
  border-bottom: 1px solid #444;
`;

export const ItemColumn2 = styled(Column2)`
  height: 50px;
  line-height: 50px;
  white-space: pre-line;

  font-size: ${({ theme }) => theme.sizes.accountCardSize4};
  & > a {
    text-decoration: none !important;
    font-weight: 300 !important;
  }
  & > a:hover {
    background: none;
    font-weight: 500 !important;
  }
`;

export const ListWrapper3 = styled.div`
  width: 100%;
  height: 100%;
`;

export const RowWrapper3 = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: nowrap;
`;

export const Column3 = styled.div`
  width: 100%;
  & {
    flex: 1 1 100%;
    text-align: center;
  }
  &:nth-child(1) {
    flex: 1 1 200px;
  }
  &:nth-child(2) {
    flex: 1 1 100%;
    text-align: center;
  }
  &:nth-child(3) {
    flex: 1 1 600px;
  }
`;

export const HeaderWrapper3 = styled(RowWrapper3)`
  height: 35px;
  line-height: 35px;
  border-bottom: 1px solid #444;
`;

export const HeaderColumn3 = styled(Column3)`
  color: ${({ theme }) => theme.colors.defaultGray3};
`;

export const ItemWrapper3 = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: nowrap;
  border-bottom: 1px solid #444;
`;

export const ItemColumn3 = styled(Column3)`
  height: 40px;
  line-height: 40px;
  white-space: pre-line;

  font-size: ${({ theme }) => theme.sizes.accountCardSize4};
  & > a {
    text-decoration: none !important;
    font-weight: 300 !important;
  }
  & > a:hover {
    background: none;
    font-weight: 500 !important;
  }
`;

export const VestingTotal = styled.div`
  position: absolute;
  top: 24px;
  right: 20px;
`;
