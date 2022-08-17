import styled from 'styled-components';
import { getRestakeStatusColor } from '../../utils/common';

export const StakingWrap = styled.div`
  width: 100%;
  float: left;
  display: flex;
  gap: 20px;

  @media only screen and (max-width: 900px) {
    flex-wrap: wrap;
  }
`;

export const StakingTextWrap = styled.div`
  width: 100%;
  padding: 30px 40px;
  background-color: ${({ theme }) => theme.colors.backgroundSideBar};
  border-radius: 4px;
`;

export const StakingTitleTypo = styled.div`
  color: #aaa;
  margin-bottom: 14px;
  font-size: 1.6rem;
`;

export const StakingContentTypo = styled.div`
  font-size: 2.7rem;
`;

export const RestakeContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: #1b1c22;
  border-radius: 4px;
`;

export const CardTitle = styled.div`
  width: calc(100% - 40px);
  background-color: #2d3037;
  padding: 20px;
  border-radius: 4px 4px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: stretch;
`;

export const CardLabel = styled.div`
  color: #cccfd6;
`;
export const CardValue = styled.div`
  display: flex;
`;

export const StatusDot = styled.div<{ status: { restakeStatus: number; isLedger: boolean } }>`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  margin: 4px 6px 0 0;
  background-color: ${(props) => `${getRestakeStatusColor(props.status.restakeStatus, props.status.isLedger)}`};
`;

export const StatusText = styled.div<{ status: { restakeStatus: number; isLedger: boolean } }>`
  color: ${(props) => `${getRestakeStatusColor(props.status.restakeStatus, props.status.isLedger)}`};
  font-weight: 600;
`;

export const StateList = styled.div`
  width: calc(100% - 40px);
  display: flex;
  flex-direction: column;
  padding: 10px 20px 20px 20px;
`;

export const StateItem = styled.div`
  position: relative;
  width: 100%;
  height: calc(50px - 16px - 16px);
  display: flex;
  font-size: 1.4rem;
  padding: 18px 0 14px 0;
  border-bottom: 1px dashed #444;
`;

export const Label = styled.div`
  width: 100%;
  text-align: left;
  color: #999;
`;

export const Value = styled.div`
  width: 100%;
  text-align: right;
  color: #8285af;
  display: flex;
  justify-content: flex-end;
`;

export const ValueBox = styled.div`
  width: 70px;
  height: 24px;
  line-height: 24px;
  background-color: #3a3a44;
  color: white;
  text-align: center;
  border-radius: 4px;
  margin-top: -7px;
`;

export const DdayDot = styled.div`
  display: flex;
  background-color: #555;
  color: #bbb;
  line-height: 15px;
  position: absolute;
  top: 15px;
  left: 80px;
  padding: 3px 8px 1px 8px;
  border-radius: 15px;
`;

export const RestakeListContainer = styled.div`
  width: calc(100% - 40px);
  display: flex;
  flex-direction: column;
  background-color: #1b1c22;
  border-radius: 4px;
  padding: 20px;
`;

export const HeaderWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 60px;
  line-height: 60px;
  flex-wrap: nowrap;
  border-bottom: 1px solid #444;
  @media only screen and (max-width: 900px) {
    display: none;
  }
`;

export const HeaderColumn = styled.div`
  width: calc(100%);
  color: #ddd;
  font-size: ${({ theme }) => theme.sizes.stakingLarge};
  display: flex;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -o-user-select: none;
  user-select: none;
  & {
    flex: 1 1 100%;
  }
  &:nth-child(1) {
    justify-content: center;
    text-align: center;
    flex: 1 1 200px;
  }
  &:nth-child(3),
  &:nth-child(4),
  &:nth-child(5) {
    justify-content: center;
    text-align: center;
  }
  &:nth-child(3),
  &:nth-child(4) {
    flex: 1 1 500px;
    min-width: 130px;
    justify-content: flex-end;
  }
  &:nth-child(5) {
    flex: 1 1 600px;
    min-width: 130px;
  }
`;

export const ItemWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
  height: 50px;
  line-height: 50px;
  border-bottom: 1px solid #444;
  color: #8285af;
`;

export const ItemColumn = styled.div`
  width: calc(100%);
  & {
    flex: 1 1 100%;
  }
  &:nth-child(1) {
    justify-content: center;
    text-align: center;
    flex: 1 1 200px;
  }
  &:nth-child(3),
  &:nth-child(4) {
    justify-content: center;
    text-align: right;
  }
  &:nth-child(3),
  &:nth-child(4) {
    flex: 1 1 500px;
    min-width: 130px;
    justify-content: flex-end;
  }
  &:nth-child(5) {
    flex: 1 1 600px;
    min-width: 130px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  font-size: ${({ theme }) => theme.sizes.stakingMedium};
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

export const MonikerTypo = styled.div`
  margin-left: 10px;
  float: left;
`;

export const StatusBox = styled.div<{ status: number }>`
  height: 20px;
  line-height: 20px;
  text-align: center;
  background-color: #555;
  color: ${(props) => `${getRestakeStatusColor(props.status)}`};
  background-color: ${(props) => `${getRestakeStatusColor(props.status)}30`};
  padding: 3px 8px 1px 8px;
  border-radius: 15px;
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
  margin-top: 10px;
  flex-direction: column;
  gap: 10px;
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
  color: #888;
`;

export const InfoValue = styled.div`
  flex: 1;
  text-align: right;
  line-height: 2.5rem;
  color: #ccc;
  font-size: 1.4rem;
`;

export const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;

export const GeneralButton = styled.div<{ active: boolean }>`
  width: 100px;
  height: 30px;
  font-size: 1.4rem;
  line-height: 30px;
  text-align: center;
  color: white;
  background-color: ${({ theme }) => theme.colors.mainblue};
  border-radius: 4px;
  cursor: pointer;
  ${(props) => (props.active ? `` : `background-color: #444;color:#777`)}
`;

export const RestakeEmptyWrapper = styled.div`
  width: 100%;
  height: 100%;
  min-height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const RestakeEmptyTypo = styled.div`
  color: #ccc;
  font-size: 1.5rem;
`;
