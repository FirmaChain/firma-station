import styled from 'styled-components';

export const TopCardWrapper = styled.div`
  width: 100%;
  margin: 80px 0 70px 0;
  display: flex;
  flex-direction: column;
  @media only screen and (max-width: 900px) {
    margin: 50px 0 50px 0;
  }
`;

export const TitleTypo = styled.div`
  width: 100%;
  text-align: center;
  line-height: 50px;
  font-size: ${({ theme }) => theme.sizes.communityTitle};
  color: #eee;
  margin-bottom: 1.6rem;
`;

export const SubTitleTypo = styled.div`
  width: 100%;
  text-align: center;
  line-height: 25px;
  color: #a1a1ac;
  font-size: ${({ theme }) => theme.sizes.communitySubTitle};
`;

export const DownloadWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
  @media only screen and (max-width: 900px) {
    gap: 10px;
  }
`;

export const DownloadItem = styled.div`
  cursor: pointer;
  text-align: center;
  opacity: 0.8;
  &:hover {
    font-weight: 600;
    opacity: 1;
  }
`;

export const DownloadItemIcon = styled.div<{ icon: string }>`
  width: 68px;
  height: 68px;
  background-image: url('${(props) => props.icon}');
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  margin: auto;
`;

export const DownloadItemIconMobile = styled.div<{ icon: string }>`
  width: 168px;
  height: 53px;
  background-image: url('${(props) => props.icon}');
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  margin: auto;
`;

export const DownloadItemTypo = styled.div`
  width: 100%;
  margin-top: 20px;
  font-size: 1.4rem;
  color: #eee;
`;

export const DownloadCard = styled.div`
  width: calc(100% - 80px);
  max-width: 600px;
  position: relative;
  padding: 40px 24px;
  border-radius: 4px;
  box-shadow: none !important;
  & > * {
    box-shadow: none !important;
  }

  background-color: ${({ theme }) => theme.colors.backgroundSideBar};
`;

export const DownloadTitle = styled.div`
  font-size: 2rem;
  color: #c5c5d1;
  margin-bottom: 30px;
  text-align: center;
`;

export const DownloadContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
`;
