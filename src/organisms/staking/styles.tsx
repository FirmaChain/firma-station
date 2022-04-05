import styled from "styled-components";

export const StakingWrap = styled.div`
  width: calc(100% - 40px);
  height: 60px;
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.backgroundSideBar};
  border-radius: 4px;
  float: left;
  display: flex;
  @media only screen and (max-width: 1550px) {
    flex-wrap: wrap;
    height: auto;
    gap: 20px 0;
  }
`;

export const StakingTextWrap = styled.div`
  width: 100%;
  margin: auto;
  flex: 1;
  text-align: center;
  border-right: 1px solid #444;
  &:last-child {
    border: 0;
  }
  @media only screen and (max-width: 1550px) {
    border: 0;
    width: 50%;
    min-width: 200px;
    flex: auto;
  }
`;

export const StakingTitleTypo = styled.div`
  color: #aaa;
  margin-bottom: 8px;
  font-size: ${({ theme }) => theme.sizes.stakingCardSize1};
`;

export const StakingContentTypo = styled.div`
  font-size: ${({ theme }) => theme.sizes.stakingCardSize2};
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
    flex: 1 1 400px;
    min-width: 130px;
  }
  &:nth-child(7) {
    text-align: center;
    flex: 1 1 230px;
    min-width: 100px;
  }
`;

export const ItemWrapper = styled(RowWrapper)`
  height: 50px;
  line-height: 50px;
  border-bottom: 1px solid #444;
`;

export const ItemColumn = styled(Column)`
  font-size: ${({ theme }) => theme.sizes.stakingMedium};
`;

export const APYTypo = styled.div`
  color: white;
  font-size: ${({ theme }) => theme.sizes.stakingSmall};
  line-height: 14px;
  text-align: right;
`;

export const APRTypo = styled.div`
  color: #f4b017;
  margin-top: 9px;
  text-align: right;
  font-size: ${({ theme }) => theme.sizes.stakingXLarge};
  line-height: 20px;
`;

export const HeaderWrapper = styled(RowWrapper)`
  height: 70px;
  line-height: 70px;
  border-bottom: 1px solid #444;
  @media only screen and (max-width: 900px) {
    display: none;
  }
`;

export const HeaderColumn = styled(Column)`
  color: #ddd;
  font-size: ${({ theme }) => theme.sizes.stakingLarge};
  display: flex;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -o-user-select: none;
  user-select: none;
  &:nth-child(1),
  &:nth-child(3),
  &:nth-child(4),
  &:nth-child(5),
  &:nth-child(6),
  &:nth-child(7) {
    justify-content: center;
  }
  &:nth-child(2),
  &:nth-child(3),
  &:nth-child(4),
  &:nth-child(5),
  &:nth-child(6),
  &:nth-child(7) {
    cursor: pointer;
  }
`;

export const ListWrapper = styled.div`
  width: calc(100% - 40px);
  height: 100%;
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.backgroundSideBar};
  border-radius: 4px;
`;

export const ProfileImage = styled.div<{ src?: string }>`
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background-color: gray;
  margin-top: 10px;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  float: left;
  ${(props) =>
    props.src ? `background-image:url('${props.src}')` : `background-image: url("${props.theme.urls.profile}");`}
`;
export const ProfileImage2 = styled.div<{ src?: string }>`
  width: 25px;
  height: 25px;
  border-radius: 15px;
  margin-top: 8px;
  background-color: gray;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  float: left;
  ${(props) =>
    props.src ? `background-image:url('${props.src}')` : `background-image: url("${props.theme.urls.profile}");`}
`;
export const MonikerTypo = styled.div`
  margin-left: 10px;
  float: left;
`;

export const DelegationItemWrapper = styled(RowWrapper)`
  height: 45px;
  line-height: 45px;
`;

export const DelegationItemColumn = styled.div`
  width: 100%;
  text-align: center;
  font-size: ${({ theme }) => theme.sizes.stakingMedium};
  &:nth-child(1) {
    flex: 1;
    text-align: left;
    padding-left: 5px;
    padding-right: 5px;
  }
  &:nth-child(2) {
    flex: 1;
    text-align: right;
  }
  &:nth-child(3) {
    flex: 1;
    text-align: right;
    margin-right: 20px;
  }
`;

export const DelegationHeaderWrapper = styled(RowWrapper)`
  width: 100%;
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #444;
`;

export const DelegationHeaderColumn = styled.div`
  color: #ddd;
  font-size: ${({ theme }) => theme.sizes.stakingLarge};
  text-align: center;
  &:nth-child(1) {
    flex: 1;
    text-align: left;
    padding-left: 5px;
    padding-right: 5px;
  }
  &:nth-child(2) {
    flex: 1;
    text-align: right;
  }
  &:nth-child(3) {
    flex: 1;
    margin-right: 20px;
    text-align: right;
  }
`;

export const UndelegationItemWrapper = styled(RowWrapper)`
  height: 45px;
  line-height: 45px;
`;

export const UndelegationItemColumn = styled.div`
  width: 100%;
  text-align: center;
  font-size: ${({ theme }) => theme.sizes.stakingMedium};
  &:nth-child(1) {
    flex: 1;
    text-align: left;
    padding-left: 5px;
    padding-right: 5px;
  }
  &:nth-child(2) {
    flex: 1;
    text-align: right;
  }
  &:nth-child(3) {
    flex: 1;
    text-align: center;
    margin-right: 5px;
    min-width: 16rem;
    font-size: ${({ theme }) => theme.sizes.stakingSmall};
  }
`;

export const UndelegationHeaderWrapper = styled(RowWrapper)`
  width: 100%;
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #444;
`;

export const UndelegationHeaderColumn = styled.div`
  color: #ddd;
  font-size: ${({ theme }) => theme.sizes.stakingLarge};
  text-align: center;
  &:nth-child(1) {
    flex: 1;
    text-align: left;
    padding-left: 5px;
    padding-right: 5px;
  }
  &:nth-child(2) {
    flex: 1;
    text-align: right;
  }
  &:nth-child(3) {
    flex: 1;
    min-width: 16rem;
    margin-right: 5px;
  }
`;

export const RedelegationItemWrapper = styled(RowWrapper)`
  height: 45px;
  line-height: 45px;
`;

export const RedelegationItemColumn = styled.div`
  width: 100%;
  text-align: center;
  font-size: ${({ theme }) => theme.sizes.stakingMedium};
  &:nth-child(1) {
    flex: 1;
    min-width: 13rem;
    text-align: left;
    padding-left: 5px;
    padding-right: 5px;
  }
  &:nth-child(2) {
    flex: 1;
    min-width: 13rem;
    text-align: left;
  }
  &:nth-child(3) {
    flex: 1;
    text-align: right;
    margin-right: 5px;
  }
  &:nth-child(4) {
    flex: 1;
    min-width: 16rem;
    margin-right: 5px;
    font-size: ${({ theme }) => theme.sizes.stakingSmall};
  }
`;

export const RedelegationHeaderWrapper = styled(RowWrapper)`
  width: 100%;
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #444;
`;

export const RedelegationHeaderColumn = styled.div`
  color: #ddd;
  font-size: ${({ theme }) => theme.sizes.stakingLarge};
  text-align: center;
  &:nth-child(1) {
    flex: 1;
    min-width: 13rem;
    text-align: left;
    padding-left: 5px;
    padding-right: 5px;
  }
  &:nth-child(2) {
    flex: 1;
    min-width: 13rem;
    text-align: left;
  }
  &:nth-child(3) {
    flex: 1;
    text-align: right;
    margin-right: 5px;
  }
  &:nth-child(4) {
    flex: 1;
    min-width: 16rem;
    margin-right: 5px;
  }
`;

export const TabListItem = styled.div``;

export const DelegationTab = styled.div`
  font-size: ${({ theme }) => theme.sizes.defaultSize};
  display: flex;
  padding-bottom: 10px;
`;

export const DelegationTabItem = styled.div<{ isActive: boolean }>`
  width: 13.8rem;
  text-align: center;
  padding: 10px;
  font-size: ${({ theme }) => theme.sizes.defaultSize};
  cursor: pointer;
  color: #888;
  ${(props) =>
    props.isActive &&
    `
    color:white;
    border-bottom:1px solid white;
  `}
`;

export const FlexWrapper = styled.div`
  width: 100%;
  height: calc(100% - 20px);
  position: relative;
  background-color: ${({ theme }) => theme.colors.backgroundSideBar};
  border-radius: 4px;
  display: flex;
  align-items: center;
  @media only screen and (max-width: 1550px) {
    flex-wrap: wrap;
  }
`;

export const DelegationListWrapper = styled.div`
  width: calc(50% - 35px);
  height: 260px;
  padding: 20px 10px 20px 15px;
  @media only screen and (max-width: 1550px) {
    width: 100%;
    padding: 20px;
  }
`;

export const ChartWrapper = styled.div`
  width: 50%;
  height: 280px;
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  @media only screen and (max-width: 1550px) {
    width: 100%;
  }
`;

export const ChartCenterTypoWrapper = styled.div`
  position: absolute;
  top: 118px;
  left: 50%;
  display: flex;
  flex-direction: column;
  text-align: center;
  transform: translate(-50%, 0);
`;

export const ChartCenterTypo = styled.div`
  font-size: ${({ theme }) => theme.sizes.stakingXXLarge};
  margin-bottom: 8px;
  font-size: ${({ theme }) => theme.sizes.stakingCardSize1};
  &:nth-child(1) {
    color: #aaa;
  }
  &:nth-child(2) {
    font-size: ${({ theme }) => theme.sizes.stakingCardSize2};
  }
`;

export const RewardTypo = styled.div`
  height: 35px;
  line-height: 35px;
  font-size: ${({ theme }) => theme.sizes.stakingSmall};
`;

export const ButtonWrapper = styled.div`
  position: absolute;
  top: 20px;
  right: 25px;
  display: flex;
`;

export const Button = styled.div<{ isActive?: boolean }>`
  height: 35px;
  padding-left: 10px;
  padding-right: 10px;
  line-height: 35px;
  color: white;
  text-align: center;
  font-size: ${({ theme }) => theme.sizes.defaultSize};
  cursor: pointer;
  background-color: ${({ theme }) => theme.colors.mainblue};
  border-radius: 4px;
  ${(props) => (props.isActive ? `` : `background-color: #444;color:#777`)}
`;

export const ItemSmallWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(100% - 20px);
  margin-top: 20px;
  padding-bottom: 20px;
  padding-left: 10px;
  padding-right: 10px;
  border-bottom: 1px solid #444;
  font-size: ${({ theme }) => theme.sizes.defaultSize};
`;

export const ProfileWrapper = styled.div`
  width: 100%;
  display: flex;
  gap: 0 10px;
  height: 30px;
  line-height: 30px;
  margin-bottom: 10px;
`;

export const ProfileImageSmall = styled.div<{ src?: string }>`
  width: 30px;
  min-width: 30px;
  height: 30px;
  border-radius: 15px;
  background-color: gray;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  float: left;
  ${(props) =>
    props.src ? `background-image:url('${props.src}')` : `background-image: url("${props.theme.urls.profile}");`}
`;
export const Moniker = styled.div`
  flex: 1 1 100%;
  color: white;
`;

export const ArrowIcon = styled.div`
  font-size: 1.3rem;
  font-weight: 900;
  text-align: right;
  padding-top: 1px;
`;
export const ValidatorInfoList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;
export const ValidatorInfo = styled.div`
  width: 100%;
  display: flex;
  &:last-child {
    & > div:nth-child(2) {
      display: flex;
      justify-content: flex-end;
    }
  }
`;

export const InfoLabel = styled.div`
  flex: 1;
  height: 2.5rem;
  line-height: 2.5rem;
`;

export const InfoValue = styled.div`
  flex: 1;
  text-align: right;
  line-height: 2.5rem;
  color: #ccc;
`;

export const APYTypoSmall = styled.div`
  color: white;
  font-size: ${({ theme }) => theme.sizes.stakingSmall};
  line-height: 1.4rem;
  text-align: right;
  padding-top: 0.3rem;
`;

export const APRTypoSmall = styled.div`
  color: #f4b017;
  text-align: right;
  font-size: ${({ theme }) => theme.sizes.stakingXLarge};
  line-height: 2rem;
`;

export const SmallTitle = styled.div`
  color: #ccc;
  font-size: ${({ theme }) => theme.sizes.stakingLarge};
`;

export const SortArrow = styled.div<{ order?: number; orderBy?: number; index?: number }>`
  width: 14px;
  height: 70px;
  margin-left: 3px;
  background-image: url("${(props) => {
    if (props.orderBy === props.index) {
      return props.order === 0 ? props.theme.urls.sortASC : props.theme.urls.sortDESC;
    } else {
      return props.theme.urls.sortIdle;
    }
  }}");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  cursor: pointer;
`;
