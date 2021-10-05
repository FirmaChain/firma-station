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
  width: 100%;
  height: 30px;
  line-height: 30px;
  font-size: ${({ theme }) => theme.sizes.accountCardSize2};
  color: ${({ theme }) => theme.colors.defaultGray2};
  float: left;
`;

export const UserBalanceTypo = styled.div`
  height: 20px;
  line-height: 20px;
  width: 100%;
  margin-top: 20px;
  font-size: ${({ theme }) => theme.sizes.accountCardSize1};
  float: left;
  text-align: left;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.realWhite};
`;

export const CopyIconImg = styled(FileCopyIcon)`
  margin-top: 2px;
  float: left;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.realWhite};
`;

export const StakingWrap = styled.div`
  width: calc(100% - 150px);
  height: 100%;
  float: left;
  display: flex;
`;

export const StakingTextWrap = styled.div`
  width: 100%;
  margin: auto;
  flex: 1;
  text-align: center;
`;

export const StakingTitleTypo = styled.div`
  color: #aaa;
  margin-bottom: 6px;
  font-size: ${({ theme }) => theme.sizes.stakingCardSize1};
`;
export const StakingContentTypo = styled.div`
  font-size: ${({ theme }) => theme.sizes.stakingCardSize2};
`;
