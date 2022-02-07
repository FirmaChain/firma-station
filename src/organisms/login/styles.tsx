import styled from "styled-components";
import LogoutIcon from "@mui/icons-material/Logout";

export const LoginContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.backgroundSideBar};
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const LoginWrapper = styled.div`
  width: 400px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  display: flex;
  border-radius: 4px;
`;

export const LogoImg = styled.div`
  width: 200px;
  height: 80px;
  margin-bottom: 20px;
  background-image: url("${({ theme }) => theme.urls.fullLogo}");
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center center;
`;

export const LoginInputWrapper = styled.div`
  width: 100%;
`;

export const InputBoxDefault = styled.input`
  width: calc(100% - 24px);
  height: 35px;
  line-height: 35px;
  margin: 0 auto 10px auto;
  padding: 0 10px;
  color: white;
  background-color: #21212f;
  border: 1px solid #696974;
  border-radius: 4px;
  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

export const LoginButton = styled.div<{ active: boolean }>`
  width: 100px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  margin: 10px auto 0 auto;
  color: white;
  background-color: ${({ theme }) => theme.colors.mainblue};
  border-radius: 4px;
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
