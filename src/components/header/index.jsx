import React from "react";

import { HeaderContainer, MenuList, MenuItem, Badge, QrWapper, QrImage, QrText } from "./styles";

function Header() {
  return (
    <HeaderContainer>
      <QrWapper>
        <QrImage />
        <QrText>Import QR Code</QrText>
      </QrWapper>
      <MenuList>
        <MenuItem>
          <Badge />
          IMPERIUM-2
        </MenuItem>
        <MenuItem>LOGOUT</MenuItem>
      </MenuList>
    </HeaderContainer>
  );
}

export default Header;
