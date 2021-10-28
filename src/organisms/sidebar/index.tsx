import React from "react";
import { Link, useLocation } from "react-router-dom";
import { EXPLORER_URI } from "../../config";

import HomeIcon from "@mui/icons-material/Home";
import AccountsIcon from "@mui/icons-material/AccountBalanceWallet";
import HistoryIcon from "@mui/icons-material/History";
import StakingIcon from "@mui/icons-material/Inbox";
import GovernmentIcon from "@mui/icons-material/AccountBalance";
import SwapIcon from "@mui/icons-material/SwapHoriz";
import NewsIcon from "@mui/icons-material/Chat";
import SupportsIcon from "@mui/icons-material/Help";
import BuyFirmaIcon from "@mui/icons-material/Payment";
import ExplorerIcon from "@mui/icons-material/Archive";
import SettingsIcon from "@mui/icons-material/Settings";

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
    externalLink: EXPLORER_URI,
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
                $isSelected={"/" + location.pathname.split("/")[1] === menu.path}
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
