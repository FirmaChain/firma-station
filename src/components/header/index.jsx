import { Typography } from "@material-ui/core";
import React from "react";

import styled from "styled-components";

import theme from "../../theme";

const HeaderContainer = styled.div`
  width: 100%;
  height: 80px;
  padding: 0 40px;
  background-color: ${({ theme }) => theme.colors.backgroundBlack};
  color: ${({ theme }) => theme.colors.defaultFont};
`;

const MenuList = styled.div`
  height: 100%;
  display: inline-flex;
  justify-content: flex-end;
  float: right;
`;
const MenuItem = styled.div`
  height: 26px;
  line-height: 26px;
  margin: 24px 0;
  padding: 3px 10px 1px 10px;
  color: #8285af;
  font-size: 13px;
`;

const Badge = styled.div`
  width: 13px;
  height: 13px;
  margin: 5px 8px;
  border-radius: 13px;
  background-color: ${theme.colors.maingreen};
  float: left;
`;

const QrImage = styled.img`
  width: 15px;
  height: 15px;
  float: left;
`;

const QrText = styled.div`
  width: 300px;
  height: 15px;
  float: left;
  margin-left: 6px;
  line-height: 15px;
  font-size: 15px;
`;

function Header() {
  const menus = [{ name: "Logout", path: "/Logout" }];

  return (
    <HeaderContainer>
      <Typography style={{ float: "left", display: "inline-block", marginTop: "35px", color: "#aaa" }}>
        <QrImage src="/images/qr.png" />
        <QrText>Import QR Code</QrText>
      </Typography>
      <MenuList>
        <MenuItem
          style={{
            marginRight: "12px",
          }}
        >
          <Badge />
          IMPERIUM-2
        </MenuItem>

        <MenuItem
          style={{
            backgroundColor: "#1e2650",
            border: "1px solid #324AB8",
            borderRadius: "4px",
          }}
        >
          LOGOUT
        </MenuItem>
      </MenuList>
    </HeaderContainer>
  );
}

export default Header;
