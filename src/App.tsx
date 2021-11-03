import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";

import { getRandomKey } from "./utils/keystore";
import { walletActions, modalActions } from "./redux/action";
import useFirma from "./utils/wallet";
import Routes from "./routes";

import Sidebar from "./organisms/sidebar";
import Header from "./organisms/header";
import Footer from "./organisms/footer";
import LoginCard from "./organisms/login";

import "./default.css";
import theme from "./themes";
import { RightContainer, MainContainer } from "./styles/common";

const App = () => {
  const { isNeedLogin } = useFirma();

  useEffect(() => {
    walletActions.handleWalletTimeKey(getRandomKey());
    modalActions.handleModalReset();
  }, []);

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        {isNeedLogin() && <LoginCard />}
        <MainContainer>
          <Sidebar />
          <RightContainer>
            <Header />
            <Routes />
            <Footer />
          </RightContainer>
        </MainContainer>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
