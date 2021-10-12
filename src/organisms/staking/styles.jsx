import styled from "styled-components";

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
