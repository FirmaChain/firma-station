import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { useSelector } from 'react-redux';

import Routes from './routes';
import useFirma from './utils/wallet';
import { rootState } from './redux/reducers';
import { SessionTimer } from './utils/sessionTimer';

import Sidebar from './organisms/sidebar';
import Header from './organisms/header';
import Footer from './organisms/footer';
import LoginCard from './organisms/login';
import { RightContainer, MainContainer } from './styles/common';

import theme from './themes';
import './default.css';
import { initializeAvatar } from './utils/avatar';

const App = () => {
  const { isInit } = useSelector((state: rootState) => state.wallet);
  const { lastUpdated } = useSelector((state: rootState) => state.avatar);

  const { initializeFirma, checkSession, isValidWallet } = useFirma();

  useEffect(() => initializeFirma(), [isInit]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => initializeAvatar(lastUpdated), []); // eslint-disable-line react-hooks/exhaustive-deps

  SessionTimer(() => checkSession());

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        {isValidWallet() === false ? (
          <LoginCard />
        ) : (
          <MainContainer>
            <Sidebar />
            <RightContainer>
              <Header />
              <Routes />
              <Footer />
            </RightContainer>
          </MainContainer>
        )}
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
