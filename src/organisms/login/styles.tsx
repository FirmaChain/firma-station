import styled from 'styled-components';
import LogoutIcon from '@mui/icons-material/Logout';

export const LoginContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.backgroundBlack};
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const TitleWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

export const LoginWrapper = styled.div`
  width: calc(560px - 17px);
  padding: 50px 34px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  display: flex;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.backgroundSideBar};
`;

export const LogoImg = styled.div`
  width: 288px;
  height: 52px;
  background-image: url('${({ theme }) => theme.urls.loginLogo}');
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center center;
`;

export const LockIcon = styled.div`
  width: 96px;
  height: 96px;
  background-image: url('${({ theme }) => theme.urls.lock}');
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center center;
  margin-top: 10px;
  margin-bottom: 30px;
`;

export const LoginInputWrapper = styled.div`
  width: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  display: flex;
`;

export const InputBoxDefault = styled.input`
  width: calc(100% - 20px);
  height: 48px;
  line-height: 48px;
  margin: 0 auto 0 auto;
  padding: 0 10px;
  color: white;
  font-size: 1.6rem;
  background-color: #212124;
  border: 0px;
  border-radius: 4px;
  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &:focus {
    outline: none !important;
  }
`;

export const LoginDescription = styled.div`
  white-space: pre;
  display: flex;
  color: #b5b5b5;
  font-size: 1.6rem;
  text-align: center;
  line-height: 24px;
  margin-bottom: 50px;
`;

export const LoginButton = styled.div<{ active: boolean }>`
  width: 100%;
  height: 48px;
  line-height: 48px;
  text-align: center;
  margin-top: 40px;
  color: white;
  background-color: ${({ theme }) => theme.colors.mainblue};
  border-radius: 4px;
  font-size: 1.8rem;
  cursor: pointer;
  ${(props) => (props.active ? `` : `background-color: #444;color:#777`)}
`;

export const LogoutIconImg = styled(LogoutIcon)`
  width: 18px !important;
  height: 18px !important;
  margin-right: 5px;
  margin-top: 1px;
  float: left;
  cursor: pointer;
  background-size: contain;
`;

export const LogoutWrap = styled.div`
  display: flex;
  color: #bbb;
  cursor: pointer;
  position: absolute;
  top: 30px;
  right: 30px;
`;

export const LogoutTypo = styled.div`
  height: 20px;
  line-height: 20px;
  font-size: ${({ theme }) => theme.sizes.logout};
`;
