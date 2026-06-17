import { SnackbarProvider } from 'notistack';
import ReactDOM from 'react-dom/client';

import App from './App';

import './apollo';
import './main.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
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
);
