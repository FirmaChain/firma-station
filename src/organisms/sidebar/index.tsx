import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import { mainMenuList, subMenuList, bottomMenuList } from '../../constants/sidebar';
import {
  DrawerStyled,
  LogoImg,
  MainMenuWrapper,
  MainMenuList,
  MainMenuItem,
  MainMenuIcon,
  MainMenuLabel,
  SubMenuWrapper,
  SubMenuList,
  SubMenuItem,
  SubMenuIcon,
  SubMenuLabel,
  BottomMenuWrapper,
  BottomMenuList,
  BottomMenuItem,
  BottomMenuLabel,
  MenuDivider,
  LinkIcon,
} from './styles';

function Sidebar() {
  const location = useLocation();

  const linkTo = (e: any, externalLink: string) => {
    if (externalLink !== '') {
      e.preventDefault();
      window.open(externalLink);
    }
  };
  return (
    <DrawerStyled variant='permanent' anchor='left'>
      <Link to={{ pathname: `/` }}>
        <LogoImg />
      </Link>

      <MainMenuWrapper>
        <MainMenuList>
          {mainMenuList.map((menu, index) => {
            return (
              <MainMenuItem
                key={index}
                selected={'/' + location.pathname.split('/')[1] === menu.path}
                onClick={(e) => linkTo(e, menu.externalLink)}
                to={{ pathname: menu.path }}
              >
                <MainMenuIcon>
                  <menu.icon />
                </MainMenuIcon>
                <MainMenuLabel>{menu.name}</MainMenuLabel>
              </MainMenuItem>
            );
          })}
        </MainMenuList>
      </MainMenuWrapper>

      <MenuDivider>&nbsp;</MenuDivider>

      <SubMenuWrapper>
        <SubMenuList>
          {subMenuList.map((menu, index) => {
            return (
              <SubMenuItem key={index} onClick={(e) => linkTo(e, menu.externalLink)} to={{ pathname: menu.path }}>
                <SubMenuIcon>
                  <menu.icon />
                </SubMenuIcon>
                <SubMenuLabel>
                  {menu.name}
                  <LinkIcon />
                </SubMenuLabel>
              </SubMenuItem>
            );
          })}
        </SubMenuList>
      </SubMenuWrapper>

      <MenuDivider>&nbsp;</MenuDivider>

      <BottomMenuWrapper>
        <BottomMenuList>
          {bottomMenuList.map((menu, index) => {
            return (
              <BottomMenuItem key={index} onClick={(e) => linkTo(e, menu.externalLink)} to={{ pathname: menu.path }}>
                <BottomMenuLabel>
                  {menu.name}
                  <LinkIcon />
                </BottomMenuLabel>
              </BottomMenuItem>
            );
          })}
        </BottomMenuList>
      </BottomMenuWrapper>
    </DrawerStyled>
  );
}

export default React.memo(Sidebar);
