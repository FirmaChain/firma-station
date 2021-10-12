import styled from "styled-components";

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
  margin: 24px 0;
  margin-right: 12px;
  cursor: pointer;
  padding: 3px 10px 1px 10px;
`;

export const NetworkStatus = styled.div`
  width: 13px;
  height: 13px;
  margin: 5px 8px;
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
  display: inline-block;
  margin-top: 35px;
  color: ${({ theme }) => theme.colors.defaultDarkGray};
`;

export const QrImage = styled.img`
  width: 15px;
  height: 15px;
  float: left;
  background-image: url("${({ theme }) => theme.urls.qr}");
  background-size: contain;
`;

export const QrText = styled.div`
  width: 300px;
  height: 15px;
  float: left;
  margin-left: 6px;
  line-height: 15px;
  font-size: ${({ theme }) => theme.sizes.headerContent};
`;
