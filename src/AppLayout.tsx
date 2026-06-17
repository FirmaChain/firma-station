import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';

import Contact from './organisms/contact';
import Footer from './organisms/footer';
import Header from './organisms/header';
import LoginCard from './organisms/login';
import Notice from './organisms/notice';
import Sidebar from './organisms/sidebar';
import Routes from './routes';
import { useWalletStore } from './store';
import { MainContainer, RightContainer } from './styles/common';
import { getContactAddressList, getNotice } from './utils/externalData';
import useFirma from './utils/wallet';

const AppLayout = () => {
	const { address } = useWalletStore((state) => state);
	const { isValidWallet } = useFirma();
	const location = useLocation();

	const [maintenance, setMaintenance] = useState<{
		isShow: boolean;
		title: string;
		content: string;
		link: string;
	} | null>(null);

	const [contactAddressList, setContactAddressList] = useState<string[] | null>(null);

	const [isNotice, setNotice] = useState(false);
	const [isContact, setContact] = useState(false);
	const [isLogin, setLogin] = useState(false);
	const [isLoaded, setLoaded] = useState(false);

	useEffect(() => {
		// Skip network calls if in offline mode
		const isOfflineMode = location.pathname.includes('/offline-mode');
		if (isOfflineMode) {
			setMaintenance(null);
			setContactAddressList([]);
			return;
		}

		getNotice()
			.then((maintenance) => setMaintenance(maintenance))
			.catch(() => {});
	}, [address, location.pathname]);

	useEffect(() => {
		// Skip network calls if in offline mode
		const isOfflineMode = location.pathname.includes('/offline-mode');
		if (isOfflineMode) {
			setContactAddressList([]);
			return;
		}

		getContactAddressList()
			.then((contactAddressList) => setContactAddressList(contactAddressList))
			.catch(() => {});
	}, [address, location.pathname]);

	useEffect(() => {
		const isOfflineMode = location.pathname.includes('/offline-mode');

		// In offline mode, set loaded to true immediately
		if (isOfflineMode) {
			setLoaded(true);
			setNotice(false);
			setContact(false);
			setLogin(false);
		} else {
			setLoaded(maintenance !== null && contactAddressList !== null);
			setNotice(maintenance !== null && maintenance.isShow);
			setContact(contactAddressList !== null && contactAddressList.includes(address));
			setLogin(isValidWallet() === false);
		}
	}, [maintenance, contactAddressList, location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

	const render = () => {
		if (!isLoaded) return <MainContainer />;
		if (isNotice) return <Notice maintenance={maintenance} />;
		if (isContact) return <Contact />;

		if (isLogin) {
			return <LoginCard />;
		} else {
			return (
				<MainContainer>
					<Sidebar />
					<RightContainer>
						<Header />
						<Routes />
						<Footer />
					</RightContainer>
				</MainContainer>
			);
		}
	};

	return render();
};

export default AppLayout;
