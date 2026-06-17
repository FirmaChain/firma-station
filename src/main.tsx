import { SnackbarProvider } from 'notistack';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';

import App from './App';
import store from './redux/store';

import './apollo';
import './main.css';

const persistor = persistStore(store);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
	<Provider store={store}>
		<PersistGate loading={null} persistor={persistor}>
			<SnackbarProvider
				maxSnack={3}
				style={{ fontSize: '1.2rem' }}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center'
				}}
			>
				<App />
			</SnackbarProvider>
		</PersistGate>
	</Provider>
);
