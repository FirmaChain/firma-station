import styled from "styled-components";

export const StakingWrap = styled.div`
  width: calc(100%);
  height: 100%;
  float: left;
  display: flex;
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
    flex: 1 1 300px;
  }
`;

export const ItemWrapper = styled(RowWrapper)`
  height: 50px;
  line-height: 50px;
  border-bottom: 1px solid #444;
`;

export const ItemColumn = styled(Column)``;

export const HeaderWrapper = styled(RowWrapper)`
  height: 70px;
  line-height: 70px;
  border-bottom: 1px solid #444;
`;

export const HeaderColumn = styled(Column)`
  color: #ddd;
`;

export const ListWrapper = styled.div`
  width: 100%;
  height: 100%;
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
