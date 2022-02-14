import React, { useState } from "react";
import Hamburger from "hamburger-react";
import { Link } from "react-router-dom";

import { EXPLORER_URI } from "../../config";

import {
  HeaderMobileContainer,
  HeaderWrapper,
  HeaderLeft,
  HeaderRight,
  HeaderTypoMobile,
  HeaderIcon,
  MobileMenuList,
  MobileMenuItem,
} from "./styles";

const menus = [
  { name: "Home", path: "/", externalLink: "" },
  { name: "Staking", path: "/staking", externalLink: "" },
  { name: "Governance", path: "/government", externalLink: "" },
  { name: "Community", path: "/community", externalLink: "" },
  {
    name: "Buy Firma",
    path: "/market",
    externalLink: "https://coinmarketcap.com/currencies/firmachain/markets",
  },
  {
    name: "Explorer",
    path: "/explorer",
    externalLink: EXPLORER_URI,
  },
];

const HeaderMobile = () => {
  const [isOpen, setOpen] = useState(false);

  return (
    <HeaderMobileContainer>
      <HeaderWrapper>
        <Link to={{ pathname: `/` }}>
          <HeaderLeft>
            <HeaderIcon />
            <HeaderTypoMobile>Firma Station</HeaderTypoMobile>
          </HeaderLeft>
        </Link>
        <HeaderRight>
          <Hamburger size={26} toggled={isOpen} toggle={setOpen} />
        </HeaderRight>
      </HeaderWrapper>
      <MobileMenuList isShow={isOpen}>
        {menus.map((menu, index) => {
          if (menu.externalLink !== "") {
            return (
              <MobileMenuItem
                key={index}
                to={"#"}
                onClick={() => {
                  window.open(menu.externalLink);
                }}
              >
                {menu.name}
              </MobileMenuItem>
            );
          } else {
            return (
              <MobileMenuItem
                key={index}
                to={menu.path}
                onClick={() => {
                  setOpen(false);
                }}
              >
                {menu.name}
              </MobileMenuItem>
            );
          }
        })}
      </MobileMenuList>
    </HeaderMobileContainer>
  );
};

export default React.memo(HeaderMobile);
