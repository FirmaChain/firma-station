import styled from "styled-components";
import SettingsIcon from "@mui/icons-material/Settings";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import QrCodeIcon from "@mui/icons-material/QrCode";

export const HeaderContainer = styled.div`
  width: calc(100% - 80px);
  height: 80px;
  padding: 0 40px;
  background-color: ${({ theme }) => theme.colors.backgroundBlack};
`;

export const HeaderRightWrapper = styled.div`
  height: 100%;
  display: inline-flex;
  justify-content: flex-end;
  float: right;
`;

export const NetworkButton = styled.div`
  height: 26px;
  line-height: 26px;
  margin: 28px 14px 26px 0;
  cursor: pointer;
`;

export const NetworkStatus = styled.div`
  width: 13px;
  height: 13px;
  margin: 5px 8px 5px 0;
  border-radius: 13px;
  background-color: ${({ theme }) => theme.colors.maingreen};
  float: left;
`;

export const NetworkText = styled.div`
  float: left;
  color: ${({ theme }) => theme.colors.defaultFont};
  font-size: ${({ theme }) => theme.sizes.headerContent};
`;

export const FaucetButton = styled.div`
  height: 26px;
  line-height: 26px;
  margin: 24px 10px 24px 0;
  cursor: pointer;
  padding: 3px 10px 1px 10px;
  color: ${({ theme }) => theme.colors.defaultFont};
  font-size: ${({ theme }) => theme.sizes.headerContent};
  background-color: ${({ theme }) => theme.colors.buttonBackground};
  border: 1px solid ${({ theme }) => theme.colors.buttonBorder};
  border-radius: 4px;
`;

export const SettingsButton = styled.div`
  height: 26px;
  line-height: 26px;
  margin: 24px 10px 24px 0;
  cursor: pointer;
  padding: 3px 10px 1px 10px;
  color: ${({ theme }) => theme.colors.defaultFont};
  font-size: ${({ theme }) => theme.sizes.headerContent};
  background-color: ${({ theme }) => theme.colors.buttonBackground};
  border: 1px solid ${({ theme }) => theme.colors.buttonBorder};
  border-radius: 4px;
`;

export const LoginoutButton = styled.div`
  height: 26px;
  line-height: 26px;
  margin: 24px 0;
  cursor: pointer;
  padding: 3px 10px 1px 10px;
  color: ${({ theme }) => theme.colors.defaultFont};
  font-size: ${({ theme }) => theme.sizes.headerContent};
  background-color: ${({ theme }) => theme.colors.buttonBackground};
  border: 1px solid ${({ theme }) => theme.colors.buttonBorder};
  border-radius: 4px;
`;

export const HeaderLeftWrapper = styled.div`
  float: left;
  display: flex;
  color: ${({ theme }) => theme.colors.defaultDarkGray};
`;

export const AddressTypo = styled.div`
  cursor: pointer;
  height: 20px;
  line-height: 20px;
  font-size: 12px;
  font-weight: 600;
  margin: 29px 0;
  padding-top: 2px;
`;

export const CopyIconImg = styled(FileCopyIcon)`
  margin: 29px 8px 29px 10px;
  padding-top: 2px;
  width: 18px !important;
  height: 18px !important;
  float: left;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.realWhite};
`;

export const QrWrap = styled.div`
  cursor: pointer;
  height: 20px;
  line-height: 20px;
  margin: 29px 5px;
  padding-top: 2px;
`;

export const SettingWrap = styled.div`
  cursor: pointer;
  height: 24px;
  line-height: 24px;
  margin: 29px 10px;
  color: white;
`;

export const QrIconImg = styled(QrCodeIcon)`
  width: 21px !important;
  height: 21px !important;
  margin: 30px 8px 29px 8px;
  float: left;
  cursor: pointer;
  background-size: contain;
  color: white;
`;

export const SettingIconImg = styled(SettingsIcon)`
  width: 21px !important;
  height: 21px !important;
  margin: 30px 10px 29px 0;
  float: left;
  cursor: pointer;
  background-size: contain;
  color: white;
`;

export const QrText = styled.div`
  width: 100px;
  height: 20px;
  float: left;
  color: white;
  margin-left: 6px;
  line-height: 22px;
  font-size: ${({ theme }) => theme.sizes.headerContent};
`;

export { SettingsIcon };
