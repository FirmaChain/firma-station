import styled from "styled-components";

export const CardWrapper = styled.div`
  display: flex;
  padding: 24px;
  background-color: ${({ theme }) => theme.colors.backgroundSideBar};
  flex-direction: column;
`;

export const DepositDetailWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px 0;
  margin-bottom: 20px;
`;

export const DepositDetailItem = styled.div`
  width: 100%;
  display: flex;
  font-size: ${({ theme }) => theme.sizes.depositCardSize1};
`;

export const DepositContent = styled.div<{ bigSize?: boolean }>`
  width: 100%;
  color: ${({ theme }) => theme.colors.defaultGray2};
  ${(props) =>
    props.bigSize && `font-size:${props.theme.sizes.depositCardSize2};color:${props.theme.colors.defaultGray}`}
`;

export const DepositMainTitle = styled.div`
  font-size: ${({ theme }) => theme.sizes.depositCardSize3};
  color: ${({ theme }) => theme.colors.defaultDarkGray};
  margin-bottom: 30px;
`;

export const DepositButton = styled.div<{ active: boolean }>`
  width: 100px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  margin: 30px auto 0 auto;
  color: white;
  background-color: ${({ theme }) => theme.colors.mainblue};
  border-radius: 4px;
  cursor: pointer;
  ${(props) =>
    props.active ? `` : `background-color: ${props.theme.colors.defaultGray5};color:${props.theme.colors.defaultGray6}`}
`;

export const TitleWrapper = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  gap: 0 10px;
  padding: 20px 0;
  margin-bottom: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.defaultGray6};
`;

export const ProposalID = styled.div`
  width: 100px;
  height: 30px;
  line-height: 30px;
  text-align: center;
`;

export const Title = styled.div`
  width: 100%;
  height: 30px;
  line-height: 30px;
  font-size: ${({ theme }) => theme.sizes.proposalDetailCardSize1};
  color: white;
`;

export const Status = styled.div`
  width: 100px;
  height: 30px;
  line-height: 30px;
  text-align: center;
`;

export const ProposalDetailWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px 0;
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.defaultGray6};
`;

export const ProposalDetailItem = styled.div`
  width: 100%;
  display: flex;
  font-size: ${({ theme }) => theme.sizes.proposalDetailCardSize2};
`;

export const Label = styled.div`
  width: 200px;
  color: ${({ theme }) => theme.colors.defaultGray3};
`;

export const ProposalContent = styled.div`
  width: 100%;
  color: ${({ theme }) => theme.colors.defaultGray};
`;

export const ProposalMainTitle = styled.div`
  font-size: 20px;
  color: ${({ theme }) => theme.colors.defaultDarkGray};
`;

export const VotingDetailWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px 0;
  padding-bottom: 20px;
  margin-bottom: 20px;
`;

export const VotingDetailItem = styled.div`
  width: 100%;
  display: flex;
  font-size: ${({ theme }) => theme.sizes.votingCardSize1};
`;

export const VotingLabel = styled.div`
  width: 200px;
  color: ${({ theme }) => theme.colors.defaultGray4};
`;

export const VotingContent = styled.div<{ bigSize?: boolean }>`
  width: 100%;
  color: ${({ theme }) => theme.colors.defaultGray2};
  ${(props) =>
    props.bigSize && `font-size:${props.theme.sizes.votingCardSize2};color:${props.theme.colors.defaultGray};`}
`;

export const VotingMainTitle = styled.div`
  font-size: ${({ theme }) => theme.sizes.votingCardSize3};
  color: ${({ theme }) => theme.colors.defaultDarkGray};
  margin-bottom: 30px;
`;

export const VotingWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const VotingData = styled.div`
  width: calc(50% - 60px);
  padding: 20px 30px;
`;

export const VotingType = styled.div`
  font-size: ${({ theme }) => theme.sizes.votingCardSize2};
  ${(props) => props.color && `color:${props.color};`}
`;

export const VotingGauge = styled.div`
  margin: 10px 0;
`;

export const VotingPercent = styled.div`
  width: 50%;
  float: left;
  color: ${({ theme }) => theme.colors.defaultDarkGray};
`;

export const VotingValue = styled.div`
  width: 50%;
  float: left;
  text-align: right;
  color: ${({ theme }) => theme.colors.defaultDarkGray};
`;

export const VotingButton = styled.div<{ active: boolean }>`
  width: 100px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  margin: 30px auto 0 auto;
  color: white;
  background-color: ${({ theme }) => theme.colors.mainblue};
  border-radius: 4px;
  cursor: pointer;
  ${(props) =>
    props.active ? `` : `background-color: ${props.theme.colors.defaultGray5};color:${props.theme.colors.defaultGray6}`}
`;
