import React from "react";
import { Link, useLocation } from "react-router-dom";

import HomeIcon from "@material-ui/icons/Home";
import AccountsIcon from "@material-ui/icons/AccountBalanceWallet";
import HistoryIcon from "@material-ui/icons/History";
import StakingIcon from "@material-ui/icons/Inbox";
import GovernmentIcon from "@material-ui/icons/AccountBalance";
import SwapIcon from "@material-ui/icons/SwapHoriz";
import NewsIcon from "@material-ui/icons/Chat";
import SupportsIcon from "@material-ui/icons/Help";
import BuyFirmaIcon from "@material-ui/icons/Payment";
import ExplorerIcon from "@material-ui/icons/Archive";
import SettingsIcon from "@material-ui/icons/Settings";

import {
  DrawerStyled,
  LogoImg,
  ListStyled,
  ListItemStyled,
  ListItemIconStyled,
  ListItemTextStyled,
  BottomWrap,
  BottomMenuTypo,
  BottomIcon,
} from "./styles";

const menus = [
  { name: "Home", path: "/", icon: HomeIcon, externalLink: "" },
  { name: "Accounts", path: "/accounts", icon: AccountsIcon, externalLink: "" },
  { name: "History", path: "/history", icon: HistoryIcon, externalLink: "" },
  { name: "Staking", path: "/staking", icon: StakingIcon, externalLink: "" },
  { name: "Government", path: "/government", icon: GovernmentIcon, externalLink: "" },
  { name: "Swap", path: "/swap", icon: SwapIcon, externalLink: "" },
  { name: "News", path: "/news", icon: NewsIcon, externalLink: "" },
  { name: "Supports", path: "/supports", icon: SupportsIcon, externalLink: "" },
  {
    name: "Buy Firma",
    path: "/market",
    icon: BuyFirmaIcon,
    externalLink: "https://coinmarketcap.com/currencies/firmachain/markets",
  },
  {
    name: "Explorer",
    path: "/explorer",
    icon: ExplorerIcon,
    externalLink: "https://explorer-devnet.firmachain.org/",
  },
];

function Sidebar() {
  const location = useLocation();

  return (
    <DrawerStyled variant="permanent" anchor="left">
      <LogoImg />
      <ListStyled disablePadding={true}>
        {menus.map((menu, index) => {
          if (menu.externalLink !== "") {
            return (
              <ListItemStyled
                key={index}
                onClick={() => {
                  window.open(menu.externalLink);
                }}
                $isExternalLink={true}
              >
                <ListItemIconStyled>
                  <menu.icon />
                </ListItemIconStyled>
                <ListItemTextStyled primary={menu.name} />
              </ListItemStyled>
            );
          } else {
            return (
              <ListItemStyled
                button
                component={Link}
                to={menu.path}
                key={index}
                $isSelected={location.pathname === menu.path}
              >
                <ListItemIconStyled>
                  <menu.icon />
                </ListItemIconStyled>
                <ListItemTextStyled primary={menu.name} />
              </ListItemStyled>
            );
          }
        })}
      </ListStyled>

      <BottomWrap>
        <BottomIcon>
          <SettingsIcon />
        </BottomIcon>
        <BottomMenuTypo>Settings</BottomMenuTypo>
      </BottomWrap>
    </DrawerStyled>
  );
}

export default Sidebar;
