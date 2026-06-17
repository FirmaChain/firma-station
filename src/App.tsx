import { useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter } from 'react-router';

import AppLayout from './AppLayout';
import { useAvatarStore, useWalletStore } from './store';
import theme from './themes';
import { initializeAvatar } from './utils/avatar';
import { SessionTimer } from './utils/sessionTimer';
import useFirma from './utils/wallet';

const App = () => {
	const { isInit } = useWalletStore((state) => state);
	const { lastUpdated } = useAvatarStore((state) => state);
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
