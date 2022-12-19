import styled from 'styled-components';
import Drawer from '@mui/material/Drawer';
import { Link } from 'react-router-dom';

export const DrawerStyled = styled(Drawer)`
  & .MuiDrawer-paper {
    border: 0;
    margin: 0;
    padding: 0;
    background: ${({ theme }) => theme.colors.backgroundSideBar};
    color: ${({ theme }) => theme.colors.defaultWhite};
    width: ${({ theme }) => theme.sizes.sideMenuDrawer};
  }
  width: ${({ theme }) => theme.sizes.sideMenuDrawer};
  @media only screen and (max-width: 1400px) {
    display: none;
  }
`;

export const MainMenuWrapper = styled.div`
  width: 100%;
  display: flex;
  margin-top: 2px;
`;

export const MainMenuList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const MainMenuItem = styled(Link)<{ selected: boolean }>`
  width: calc(100% - 44px);
  display: flex;
  align-items: center;
  border-right: 4px solid transparent;
  ${(props) =>
    props.selected &&
    `
      background: ${props.theme.colors.defaultGray}25;
      border-right: 4px solid ${props.theme.colors.mainblue};
      * {
        color: ${props.theme.colors.realWhite};
      }
    `}
  cursor:pointer;
  padding: 14px 20px;
  gap: 20px;
`;

export const MainMenuIcon = styled.div`
  width: 23px;
  min-width: 23px;
  margin: 0;
  padding: 0;
  color: #eee;
  & > svg {
    font-size: ${({ theme }) => theme.sizes.sideMenuIcon};
    width: 23px;
    height: 23px;
    padding-top: 2px;
  }
`;

export const MainMenuLabel = styled.div`
  margin: 0;
  padding: 0;
  font-size: ${({ theme }) => theme.sizes.defaultSize};
  color: #eee;
`;

export const SubMenuWrapper = styled.div`
  width: 100%;
  display: flex;
`;

export const SubMenuList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const SubMenuItem = styled(Link)`
  width: calc(100% - 40px);
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 10px 20px;
  gap: 23px;
`;

export const SubMenuIcon = styled.div`
  width: 20px;
  min-width: 20px;
  margin: 0;
  padding: 0;
  color: #aaaaaa;
  & > svg {
    font-size: ${({ theme }) => theme.sizes.sideMenuIcon};
    width: 20px;
    height: 20px;
    padding-top: 2px;
  }
`;

export const SubMenuLabel = styled.div`
  margin: 0;
  padding: 0;
  font-size: ${({ theme }) => theme.sizes.singleCardTitle};
  color: #aaaaaa;
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: center;
`;

export const LogoImg = styled.div`
  height: 80px;
  margin: 0 20px;
  background-image: url('${({ theme }) => theme.urls.fullLogo}');
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center center;
`;

export const MenuDivider = styled.div`
  width: calc(100% - 42px);
  height: 1px;
  background-color: #2f2f2f;
  margin: 20px 20px;
`;

export const BottomMenuWrapper = styled.div`
  width: 100%;
  margin-bottom: 20px;
`;

export const BottomMenuList = styled.div`
  width: calc(100% - 40px);
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const BottomMenuItem = styled(Link)`
  width: 100%;
  padding: 13px 0;
  background-color: #2d4cd440;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const BottomMenuLabel = styled.div`
  margin: 0;
  padding: 0;
  font-size: ${({ theme }) => theme.sizes.singleCardTitle};
  color: #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  & > span {
    font-size: 1.2rem;
    margin-left: 5px;
  }
`;

export const LinkIcon = styled.div`
  width: 18px;
  height: 18px;
  background-image: url('${({ theme }) => theme.urls.link}');
  background-repeat: no-repeat;
  background-size: contain;
  color: white;
`;
