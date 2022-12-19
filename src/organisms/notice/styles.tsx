import styled from 'styled-components';

export const NoticeContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.backgroundSideBar};
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const NoticeWrapper = styled.div`
  z-index: 999 !important;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  display: flex;
  border-radius: 4px;
  gap: 20px;
  margin-top: -100px;
`;

export const LogoImg = styled.div`
  width: 200px;
  height: 80px;
  background-image: url('${({ theme }) => theme.urls.fullLogo}');
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center center;
`;

export const TitleTypo = styled.div`
  width: 100%;
  text-align: center;
  color: white;
  font-size: 2.4rem;
`;

export const SubTitleTypo = styled.div`
  width: 100%;
  color: #ccc;
  font-size: 1.6rem;
  white-space: pre-wrap;
  line-height: 24px;
  padding-top: 20px;
  text-align: center;
`;

export const LinkWrapper = styled.div`
  justify-content: center;
  align-items: center;
  display: flex;
  font-size: 1.4rem;
  color: #aaa;
  gap: 5px;
  text-decoration: underline;
  cursor: pointer;
`;

export const LinkIcon = styled.div`
  width: 18px;
  height: 18px;
  background-image: url('${({ theme }) => theme.urls.link}');
  background-repeat: no-repeat;
  background-size: contain;
  color: white;
`;

export const Copyright = styled.div`
  position: absolute;
  bottom: 50px;
  justify-content: center;
  align-items: center;
  display: flex;
  font-size: 1.4rem;
  text-align: center;
  color: #aaa;
  gap: 5px;
  white-space: pre-wrap;
  line-height: 24px;
`;

export const Contact = styled.div`
  position: absolute;
  bottom: 30px;
  justify-content: center;
  align-items: center;
  display: flex;
  font-size: 1.4rem;
  text-align: center;
  color: #aaa;
  gap: 5px;
  white-space: pre-wrap;
  line-height: 24px;
`;

export const BackgroundSymbol = styled.div`
  position: absolute;
  z-index: 0;
  margin: 0 50px;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('${({ theme }) => theme.urls.symbol}');
  background-size: 100%;
  background-position: center bottom;
  background-repeat: no-repeat;
`;
