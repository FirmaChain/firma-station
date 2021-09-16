import React from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { Typography } from "@material-ui/core";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

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

import { makeStyles } from "@material-ui/styles";

const LogoImg = styled.div`
  height: 80px;
  margin: 0 20px;
  background-image: url("/images/firma_chain_title.svg");
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center center;
`;

const BottomWrap = styled.div`
  height: 30px;
  line-height: 48px;
  padding: 8px 16px;
  margin-top: auto;
`;

function Sidebar() {
  const drawerWidth = 230;

  const location = useLocation();

  const useStyles = makeStyles(() => ({
    drawer: {
      width: drawerWidth,
    },
    paper: {
      color: "white",
      border: 0,
      margin: 0,
      padding: 0,
      width: drawerWidth,
      background: "black",
      display: "flex",
    },
    icon: {
      color: "#eee",
    },
    name: {
      "& span": {
        fontSize: "14px",
        color: "#afafaf",
      },
    },
    active: {
      background: "#eeeeee25",
      borderRight: "4px solid #3550DE",
      "& span": {
        color: "#efefef",
      },
    },
    externalLink: {
      cursor: "pointer",
    },
    settingIcon: {
      float: "left",
      marginRight: "30px",
      color: "#efefef",
    },
    settingTypo: {
      float: "left",
      color: "#afafaf",
    },
  }));

  const classes = useStyles();

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

  return (
    <Drawer className={classes.drawer} classes={{ paper: classes.paper }} variant="permanent" anchor="left">
      <LogoImg />
      <List disablePadding={true}>
        {menus.map((menu, index) => {
          if (menu.externalLink !== "") {
            return (
              <ListItem
                key={index}
                className={classes.externalLink}
                onClick={() => {
                  window.open(menu.externalLink);
                }}
              >
                <ListItemIcon className={classes.icon}>
                  <menu.icon />
                </ListItemIcon>
                <ListItemText className={classes.name} primary={menu.name} />
              </ListItem>
            );
          } else {
            return (
              <ListItem
                button
                component={Link}
                to={menu.path}
                key={index}
                className={location.pathname === menu.path ? classes.active : ""}
              >
                <ListItemIcon className={classes.icon}>
                  <menu.icon />
                </ListItemIcon>
                <ListItemText className={classes.name} primary={menu.name} />
              </ListItem>
            );
          }
        })}
      </List>

      <BottomWrap>
        <SettingsIcon className={classes.settingIcon} />
        <Typography className={classes.settingTypo}>Settings</Typography>
      </BottomWrap>
    </Drawer>
  );
}

export default Sidebar;
