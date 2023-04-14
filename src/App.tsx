import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { useSelector } from 'react-redux';

import useFirma from './utils/wallet';
import { rootState } from './redux/reducers';

import { SessionTimer } from './utils/sessionTimer';
import { initializeAvatar } from './utils/avatar';

import Main from './main';
import theme from './themes';
import './default.css';

const App = () => {
  const { isInit } = useSelector((state: rootState) => state.wallet);
  const { lastUpdated } = useSelector((state: rootState) => state.avatar);
  const { initializeFirma, checkSession } = useFirma();

  useEffect(() => initializeFirma(), [isInit]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => initializeAvatar(lastUpdated), []); // eslint-disable-line react-hooks/exhaustive-deps

  SessionTimer(() => checkSession());

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Main />
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
