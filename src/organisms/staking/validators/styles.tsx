import styled from "styled-components";
import FileCopyIcon from "@mui/icons-material/FileCopy";

export const CardWrapper = styled.div`
  padding: 16px 24px;
  position: -webkit-sticky;
  position: sticky;
  top: 0px;
  font-size: ${({ theme }) => theme.sizes.defaultSize};
  background-color: ${({ theme }) => theme.colors.backgroundSideBar};
  display: flex;
  z-index: 2;
  justify-content: flex-start;
  gap: 0 30px;
`;

export const InnerWrapper = styled.div`
  display: flex;
`;

export const Title = styled.div`
  width: 140px;
  text-align: center;
  height: 35px;
  line-height: 35px;
`;

export const Content = styled.div`
  width: 180px;
  text-align: left;
  height: 35px;
  line-height: 35px;
  color: white;
`;

export const Buttons = styled.div`
  display: flex;
  gap: 0 16px;
  justify-content: center;
`;

export const Button = styled.div<{ isActive?: boolean }>`
  width: 100px;
  height: 35px;
  line-height: 35px;
  color: white;
  text-align: center;
  cursor: pointer;
  background-color: ${({ theme }) => theme.colors.mainblue};
  border-radius: 4px;
  ${(props) => (props.isActive ? `` : `background-color: #444;color:#777`)}
`;

export const DelegatorsCardWrapper = styled.div`
  width: calc(100% - 48px);
  display: flex;
  padding: 24px;
  background-color: ${({ theme }) => theme.colors.backgroundSideBar};
  flex-direction: column;
  @media only screen and (max-width: 1400px) {
    width: calc(100% - 20px);
    padding: 10px;
  }
`;

export const DelegatorList = styled.div`
  width: 100%;
  height: 300px;
  display: flex;
  flex-direction: column;
  @media only screen and (max-width: 1400px) {
    height: 345px;
  }
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
    flex: 90px;
  }
  &:nth-child(3) {
    text-align: right;
    padding-right: 30px;
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

export const HeaderWrapper = styled(RowWrapper)`
  height: 50px;
  line-height: 50px;
  border-bottom: 1px solid #444;
`;

export const HeaderColumn = styled(Column)`
  color: #ddd;
  font-size: ${({ theme }) => theme.sizes.defaultSize};
`;

export const HeaderMobileWrapper = styled.div`
  width: 100%;
  height: 50px;
  line-height: 50px;
  border-bottom: 1px solid #444;
  display: flex;
  flex-wrap: nowrap;
`;

export const HeaderMobileColumn = styled.div`
  width: 100%;
  color: #ddd;
  font-size: ${({ theme }) => theme.sizes.defaultSize};
`;

export const ItemMobileWrapper = styled.div`
  width: 100%;
  height: 50px;
  line-height: 50px;
  border-bottom: 1px solid #444;
  display: flex;
  flex-wrap: nowrap;
`;

export const ItemMobileColumn = styled.div`
  width: 100%;
  display: flex;
  font-size: ${({ theme }) => theme.sizes.defaultSize};
`;

export const ValidatorCardWrapper = styled.div`
  width: calc(100% - 48px);
  display: flex;
  padding: 24px;
  background-color: ${({ theme }) => theme.colors.backgroundSideBar};
  flex-direction: column;
  @media only screen and (max-width: 1400px) {
    width: calc(100% - 20px);
    padding: 10px;
  }
`;

export const ProfileWrapper = styled.div`
  display: flex;
  position: relative;
  align-items: stretch;
  padding: 14px 0;
  gap: 0 10px;
  @media only screen and (max-width: 1400px) {
    gap: 24px 0;
    flex-wrap: wrap;
  }
`;

export const StatusWrapper = styled.div`
  width: 100%;
  display: flex;
  border-top: 1px solid #555;
  margin-top: 20px;
  padding: 24px 0 10px 0;
  gap: 30px 0;
  @media only screen and (max-width: 1400px) {
    margin-top: 10px;
    padding: 24px 0 20px 0;
    flex-wrap: wrap;
  }
`;

export const ProfileImageWrap = styled.div`
  width: 100px;
`;

export const ProfileImage = styled.div<{ src?: string }>`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  background-color: gray;
  margin-top: 8px;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  ${(props) =>
    props.src ? `background-image:url('${props.src}')` : `background-image: url("${props.theme.urls.profile}");`}
`;
export const DescriptionWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;
export const NameTypo = styled.div`
  font-size: ${({ theme }) => theme.sizes.stakingXXXLarge};
  height: 50px;
  line-height: 50px;
  color: #eee;
  @media only screen and (max-width: 1400px) {
    font-size: ${({ theme }) => theme.sizes.stakingXLarge};
  }
`;
export const DescriptionTypo = styled.div`
  font-size: ${({ theme }) => theme.sizes.stakingMedium};
  line-height: 20px;
`;

export const StatusItem = styled.div`
  width: 100%;
  text-align: center;
  @media only screen and (max-width: 1400px) {
    width: 50%;
  }
`;
export const StatusTitle = styled.div`
  height: 30px;
  line-height: 30px;
  font-size: ${({ theme }) => theme.sizes.stakingLarge};
  color: #888;
`;
export const StatusContent = styled.div`
  height: 35px;
  line-height: 35px;
  font-size: ${({ theme }) => theme.sizes.stakingXXXLarge};
  color: #eee;
`;
export const StatusSubContent = styled.div`
  font-size: ${({ theme }) => theme.sizes.defaultSize};
`;

export const LinkTypo = styled.a`
  line-height: 30px;
  text-decoration: none;
`;

export const LeftWrapper = styled.div`
  width: 50%;
  display: flex;
  gap: 20px;
  @media only screen and (max-width: 1400px) {
    width: calc(100%);
  }
`;

export const AddressInfo = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-left: 20px;
  padding-right: 10px;
  @media only screen and (max-width: 1400px) {
    width: calc(100% - 20px);
    padding: 0;
  }
`;

export const AddressWrapper = styled.div`
  position: relative;
`;

export const AddressInfoLabel = styled.div`
  font-size: ${({ theme }) => theme.sizes.stakingMedium};
  color: white;
  margin-bottom: 10px;
`;
export const AddressInfoValue = styled.div`
  font-size: ${({ theme }) => theme.sizes.stakingSemiMedium};
  cursor: pointer;
`;

export const CopyIconImg = styled(FileCopyIcon)`
  width: 18px !important;
  height: 18px !important;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.realWhite};
  position: absolute;
  top: -3px;
  left: 114px;
`;

export const ProfileImage2 = styled.div<{ src?: string }>`
  width: 30px;
  min-width: 30px;
  max-width: 30px;
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

export const DelegatorMobile = styled.div`
  font-size: ${({ theme }) => theme.sizes.defaultSize};
`;

export const DelegatorInfoMobile = styled.div`
  width: calc(100% - 40px);
  margin-left: 10px;
  margin-top: 5px;
  display: flex;
  flex-direction: column;
  & > div {
    height: 30px;
    line-height: 30px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  & > div:nth-child(1) {
    color: white;
  }
  & > div:nth-child(2) {
  }
`;
