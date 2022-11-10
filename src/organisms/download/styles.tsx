import styled from 'styled-components';

export const TopCardWrapper = styled.div`
  width: 100%;
  margin: 80px 0 70px 0;
  display: flex;
  flex-direction: column;
  @media only screen and (max-width: 900px) {
    margin: 30px 0 30px 0;
  }
`;

export const TitleTypo = styled.div`
  width: 100%;
  text-align: center;
  line-height: 50px;
  font-size: ${({ theme }) => theme.sizes.communityTitle};
  color: #eee;
`;

export const SubTitleTypo = styled.div`
  width: 100%;
  text-align: center;
  line-height: 30px;
  font-size: ${({ theme }) => theme.sizes.communitySubTitle};
`;

export const DownloadWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
  @media only screen and (max-width: 900px) {
    max-width: 200px;
  }
`;

export const DownloadItem = styled.div`
  width: 70px;
  cursor: pointer;
  text-align: center;
  opacity: 0.8;
  &:hover {
    font-weight: 600;
    opacity: 1;
  }
`;

export const DownloadItemIcon = styled.div<{ icon: string }>`
  width: 70px;
  height: 70px;
  background-image: url('${(props) => props.icon}');
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  margin: auto;
`;

export const DownloadItemTypo = styled.div`
  width: 100%;
  margin-top: 20px;
  color: #eee;
`;

export const DownloadCard = styled.div`
  position: relative;
  padding: 24px;
  border-radius: 4px;
  box-shadow: none !important;
  & > * {
    box-shadow: none !important;
  }

  background-color: ${({ theme }) => theme.colors.backgroundSideBar};
`;

export const DownloadTitle = styled.div`
  font-size: 1.6rem;
  color: white;
  margin-bottom: 30px;
`;

export const DownloadContainer = styled.div`
  display: flex;
  gap: 20px;
  @media only screen and (max-width: 900px) {
    flex-direction: column;
  }
`;
