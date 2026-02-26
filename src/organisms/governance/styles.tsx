import styled from "styled-components";

export const ListWrapper = styled.div`
  width: 100%;
  height: 100%;
  flex: 1;
`;

export const ButtonWrapper = styled.div`
  width: 100%;
  height: 50px;
`;

export const Button = styled.div`
  width: 140px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  color: white;
  background-color: ${({ theme }) => theme.colors.mainblue};
  border-radius: 4px;
  font-size: ${({ theme }) => theme.sizes.defaultSize};
  cursor: pointer;
`;

export const ItemWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: nowrap;
  border-bottom: 1px solid ${({ theme }) => theme.colors.defaultGray5};
`;

export const ItemColumn = styled.div`
  width: 100%;
  padding-top: 8px;
  font-size: ${({ theme }) => theme.sizes.defaultSize};
  & {
    flex: 1 1 100%;
  }
  &:nth-child(1) {
    text-align: center;
    flex: 1 1 120px;
    line-height: 50px;
  }
  &:nth-child(2) {
    text-align: center;
    flex: 1 1 150px;
    line-height: 50px;
  }
  &:nth-child(3) {
    text-align: center;
    flex: 1 1 300px;
    line-height: 50px;
  }
`;

export const TitleTypo = styled.div`
  cursor: pointer;
  display: inline-block;
  font-size: ${({ theme }) => theme.sizes.proposalCardSize1};
  margin-top: 14px;
  color: white;
  & > a {
    &:hover {
      background: none;
    }
    text-decoration: none;
  }
`;

export const DescriptionTypo = styled.div`
  display: block;
  font-size: ${({ theme }) => theme.sizes.proposalCardSize2};
  height: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 20px;
  margin-top: 14px;
`;

export const StatusTypo = styled.div<{ statusColor: string }>`
  display: inline-block;
  height: 40px;
  line-height: 40px;
  padding: 0px 10px;
  border-radius: 4px;
  margin-top: 10px;
  color: ${(props) => props.statusColor && props.statusColor};
  background: ${(props) => props.statusColor && props.statusColor}50;
`;

export const SmallList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const SmallItemCard = styled.div`
  position: relative;
  padding: 14px;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.backgroundSideBar};
  line-height: 24px;
  font-size: ${({ theme }) => theme.sizes.defaultSize};
`;

export const SmallProposalId = styled.div`
  height: 30px;
  line-height: 30px;
  padding-bottom: 10px;
`;

export const SmallProposalTitle = styled.div`
  font-size: ${({ theme }) => theme.sizes.stakingLarge};
  color: white;
`;

export const SmallProposalType = styled.div`
  font-size: ${({ theme }) => theme.sizes.stakingSmall};
  color: #777;
`;

export const SmallProposalStatus = styled.div`
  position: absolute;
  top: 5px;
  right: 10px;
  font-size: 1.2rem;
  & > div {
    height: 30px;
    line-height: 30px;
  }
`;
