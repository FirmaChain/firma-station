import styled from "styled-components";

export const CardWrapper = styled.div`
  display: flex;
  padding: 24px;
  background-color: ${({ theme }) => theme.colors.backgroundSideBar};
  font-size: ${({ theme }) => theme.sizes.defaultSize};
  flex-direction: column;
  position: relative;
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
  @media only screen and (max-width: 900px) {
    flex-direction: column;
  }
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
  @media only screen and (max-width: 900px) {
    flex-direction: column;
  }
`;

export const ProposalID = styled.div`
  width: 100px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  @media only screen and (max-width: 900px) {
    width: 100%;
    height: auto;
    text-align: left;
  }
`;

export const Title = styled.div`
  width: 100%;
  height: 30px;
  line-height: 30px;
  font-size: ${({ theme }) => theme.sizes.proposalDetailCardSize1};
  color: white;
  @media only screen and (max-width: 900px) {
    width: 100%;
    height: auto;
    text-align: left;
  }
`;

export const Status = styled.div`
  width: 100px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  @media only screen and (max-width: 900px) {
    position: absolute;
    top: 18px;
    right: 10px;
  }
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
  @media only screen and (max-width: 900px) {
    flex-direction: column;
  }
`;

export const Label = styled.div`
  width: 200px;
  color: ${({ theme }) => theme.colors.defaultGray4};
  @media only screen and (max-width: 900px) {
    width: 100%;
    padding-bottom: 10px;
  }
`;

export const ProposalContent = styled.div<{ isSmall?: boolean }>`
  width: 100%;
  line-height: 23px;
  color: ${({ theme }) => theme.colors.defaultGray};
  @media only screen and (max-width: 900px) {
    ${(props) => props.isSmall && `font-size: ${props.theme.sizes.stakingSmall};`}
  }
`;

export const ProposalMainTitle = styled.div`
  font-size: ${({ theme }) => theme.sizes.proposalTitle};
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
  @media only screen and (max-width: 900px) {
    flex-direction: column;
  }
`;

export const VotingLabel = styled.div`
  width: 200px;
  color: ${({ theme }) => theme.colors.defaultGray4};
  @media only screen and (max-width: 900px) {
    width: 100%;
    padding-bottom: 10px;
  }
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
  gap: 20px;
  @media only screen and (max-width: 900px) {
    gap: 10px;
  }
`;

export const VotingData = styled.div`
  width: calc(25% - 40px - 2px - 28px);
  padding: 25px 25px;
  border: 1px solid #6a709a;
  border-radius: 4px;
  @media only screen and (max-width: 900px) {
    width: calc(50% - 20px - 10px);
    padding: 10px;
  }
`;

export const VotingType = styled.div`
  width: 100%;
  float: left;
  line-height: 30px;
  font-size: ${({ theme }) => theme.sizes.votingCardSize2};
  ${(props) => props.color && `color:${props.color};`}
  @media only screen and (max-width: 900px) {
    text-align: center;
  }
`;

export const VotingGauge = styled.div`
  margin: 20px 0;
  position: relative;
`;

export const Quorum = styled.div`
  width: 100px;
  margin-left: -42px;
  position: absolute;
  top: 30px;
  left: 33%;
  text-align: center;
`;

export const Arrow = styled.div`
  position: absolute;
  top: -17px;
  left: 41px;
`;

export const VotingPercent = styled.div`
  width: 50%;
  float: left;
  line-height: 30px;
  text-align: left;
  color: ${({ theme }) => theme.colors.defaultDarkGray};
  @media only screen and (max-width: 900px) {
    width: 100%;
    color: white;
    text-align: center;
  }
`;

export const VotingValue = styled.div`
  width: 50%;
  float: left;
  line-height: 30px;
  text-align: right;
  color: ${({ theme }) => theme.colors.defaultDarkGray};
  @media only screen and (max-width: 900px) {
    width: 100%;
    text-align: center;
    font-size: ${({ theme }) => theme.sizes.stakingSmall};
  }
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

export const VotingListWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 40px;
`;

export const VotingTabWrap = styled.div`
  width: 100%;
  display: flex;
`;

export const VotingTabItem = styled.div<{ active?: boolean }>`
  width: 140px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  cursor: pointer;
  ${(props) =>
    props.active &&
    `border-bottom:1px solid ${props.theme.colors.defaultWhite}; color:${props.theme.colors.defaultWhite}`}
`;

export const VotingList = styled.div`
  width: 100%;
  height: 200px;
  margin-top: 10px;
`;

export const ItemWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: nowrap;
  border-bottom: 1px solid ${({ theme }) => theme.colors.defaultGray5};
`;

export const ItemColumn = styled.div`
  width: 100%;
  height: 50px;
  line-height: 50px;
  padding: 0 5px;
  &:nth-child(1) {
    width: 40px;
  }
  &:nth-child(3) {
    text-align: right;
  }
`;

export const ProfileImage = styled.div<{ src?: string }>`
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background-color: gray;
  margin: 10px auto;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  float: left;
  ${(props) =>
    props.src ? `background-image:url('${props.src}')` : `background-image: url("${props.theme.urls.profile}");`}
`;
