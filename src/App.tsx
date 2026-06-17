import { useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { BrowserRouter } from 'react-router';

import AppLayout from './AppLayout';
import { rootState } from './redux/reducers';
import theme from './themes';
import { initializeAvatar } from './utils/avatar';
import { SessionTimer } from './utils/sessionTimer';
import useFirma from './utils/wallet';

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
				<AppLayout />
			</ThemeProvider>
		</BrowserRouter>
	);
};

export default App;
