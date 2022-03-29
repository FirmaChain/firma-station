import styled from "styled-components";
import FileCopyIcon from "@mui/icons-material/FileCopy";

export const ListWrapper = styled.div`
  width: 100%;
  height: 100%;
  color: ${({ theme }) => theme.colors.defaultFont};
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
`;

export const HeaderWrapper = styled(RowWrapper)`
  height: 50px;
  line-height: 50px;
  border-bottom: 1px solid #444;
`;

export const HeaderColumn = styled(Column)`
  color: ${({ theme }) => theme.colors.defaultGray3};
  font-size: ${({ theme }) => theme.sizes.defaultSize};
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
  & > a {
    text-decoration: none !important;
    font-weight: 300 !important;
  }
  & > a:hover {
    background: none;
    font-weight: 500 !important;
  }
`;

export const AddressTitleTypo = styled.div`
  color: ${({ theme }) => theme.colors.realWhite};
  height: 30px;
  line-height: 30px;
  font-size: ${({ theme }) => theme.sizes.accountCardSize1};
  margin-right: 6px;
  float: left;
`;

export const UserAddressTypo = styled.div`
  width: 100%;
  height: 30px;
  line-height: 30px;
  font-size: ${({ theme }) => theme.sizes.accountCardSize2};
  color: ${({ theme }) => theme.colors.defaultGray2};
  float: left;
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

export const TokenomicsTitleTypo = styled.div`
  color: ${({ theme }) => theme.colors.defaultDarkGray};
  margin-top: 14px;
  padding: 0 14px;
  height: 30px;
  line-height: 30px;
  font-size: ${({ theme }) => theme.sizes.accountCardSize1};
`;

export const TokenomicsContainer = styled.div`
  padding: 0 14px;
  margin-top: 10px;
`;

export const CustomTooltipContainer = styled.div`
  width: 130px;
  background-color: #111;
  padding: 10px;
  border-radius: 4px;
`;

export const CustomTooltipTypo = styled.div`
  text-align: center;
`;

export const PichartWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const PiechartContainer = styled.div`
  width: 100%;
  text-align: center;
  & > div {
    margin: auto;
  }
`;

export const PiechartLabelContainer = styled.div`
  width: 100%;
  margin: 20px 0;
  display: flex;
  flex-wrap: wrap;
`;

export const PiechartLabelWrapper = styled.div`
  display: flex;
  flex: 1 1 30%;
  gap: 0 10px;
`;

export const PiechartLabelTypo = styled.div`
  width: 100%;
  height: 20px;
  line-height: 20px;
  font-size: ${({ theme }) => theme.sizes.pieChartLabel};
  color: #ccc;
`;

export const PiechartLabelIcon = styled.div<{ bgColor: string }>`
  width: 20px;
  height: 20px;
  background-color: ${(props) => props.bgColor};
  float: left;
`;

export const TokenomicsDetailWrapper = styled.div`
  width: 100%;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 24px 0;
`;

export const TokenomicsDetail = styled.div`
  width: 100%;
  display: flex;
`;

export const TokenomicsDetailTitle = styled.div`
  width: 100%;
  flex: 1;
  color: ${({ theme }) => theme.colors.defaultDarkGray};
  font-size: ${({ theme }) => theme.sizes.tokenomicsDetail};
`;

export const TokenomicsDetailContent = styled.div`
  width: 100%;
  flex: 1;
  text-align: right;
  font-size: ${({ theme }) => theme.sizes.tokenomicsDetail};
  color: ${({ theme }) => theme.colors.defaultFont};
`;

export const VotingPowerTitleTypo = styled.div`
  color: ${({ theme }) => theme.colors.defaultDarkGray};
  margin-top: 14px;
  padding: 0 14px;
  height: 30px;
  line-height: 30px;
  font-size: ${({ theme }) => theme.sizes.votingpowerSize2};
`;

export const VotingPowerContainer = styled.div`
  padding: 0 14px;
  margin-top: 10px;
`;

export const VotingPowerPercentTypo = styled.div`
  color: ${({ theme }) => theme.colors.defaultFont};
  font-size: ${({ theme }) => theme.sizes.votingpowerSize1};
`;

export const VotingPowerGaugeWrapper = styled.div`
  display: flex;
  width: 100%;
  height: auto;
  margin-top: 10px;
  margin-bottom: 40px;
`;

export const VotingPowerDetailWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px 0;
`;

export const VotingPowerDetail = styled.div`
  width: 100%;
  display: flex;
`;

export const VotingPowerDetailTitle = styled.div`
  width: 100%;
  flex: 1;
  color: ${({ theme }) => theme.colors.defaultDarkGray};
  font-size: ${({ theme }) => theme.sizes.votingpowerSize3};
`;
export const VotingPowerDetailContent = styled.div`
  width: 100%;
  flex: 1;
  text-align: right;
  font-size: ${({ theme }) => theme.sizes.votingpowerSize3};
  color: ${({ theme }) => theme.colors.defaultFont};
`;
