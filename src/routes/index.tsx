import React from 'react';
import { useSnackbar } from 'notistack';
import { Navigate, Route, Routes } from 'react-router';

import { Accounts, Community, Download, Governance, History, Home, OfflineMode, Proposals, Staking, Validators } from '../pages';
import { useWalletStore } from '../store';

const routePublic = (path: string, component: React.FC) => ({
	path,
	component,
	auth: false
});

const routePrivate = (path: string, component: React.FC) => ({
	path,
	component,
	auth: true
});

const routes = {
	Home: routePublic('/', Home),
	Accounts: routePrivate('/accounts', Accounts),
	History: routePrivate('/history', History),
	Staking: routePublic('/staking', Staking),
	Validators: routePublic('/staking/validators/:address', Validators),
	Governance: routePublic('/governance', Governance),
	Proposals: routePublic('/governance/proposals/:id', Proposals),
	Community: routePublic('/community', Community),
	Download: routePublic('/download', Download),
	OfflineMode: routePublic('/offline-mode', OfflineMode)
};

interface IProps {
	auth: boolean;
	component: React.FC;
}

const CustomRoute = ({ auth, component: Component }: IProps) => {
	const { enqueueSnackbar } = useSnackbar();
	const { address } = useWalletStore((state) => state);

	const isUnauthorized = auth && address === '';

	React.useEffect(() => {
		if (isUnauthorized) {
			enqueueSnackbar('You Need Login First', {
				variant: 'error',
				autoHideDuration: 2000
			});
		}
	}, [isUnauthorized, enqueueSnackbar]);

	if (isUnauthorized) {
		return <Navigate to="/" replace />;
	}

	return <Component />;
};

const route = () => (
	<Routes>
		{Object.values(routes).map((x, i) => (
			<Route key={i} path={x.path} element={<CustomRoute component={x.component} auth={x.auth} />} />
		))}
		<Route path="*" element={<Navigate to="/" replace />} />
	</Routes>
);

export default route;
