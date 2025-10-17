import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import Routes from './routes';
import useFirma from './utils/wallet';
import { rootState } from './redux/reducers';

import Sidebar from './organisms/sidebar';
import Header from './organisms/header';
import Footer from './organisms/footer';
import LoginCard from './organisms/login';
import Notice from './organisms/notice';
import Contact from './organisms/contact';

import { RightContainer, MainContainer } from './styles/common';
import { getNotice, getContactAddressList } from './utils/externalData';

const AppLayout = () => {
  const { address } = useSelector((state: rootState) => state.wallet);
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
  }, [address, location]);

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
  }, [address, location]);

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
  }, [maintenance, contactAddressList, location]); // eslint-disable-line react-hooks/exhaustive-deps

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
