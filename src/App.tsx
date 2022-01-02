import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { useSelector } from "react-redux";
import Routes from "./routes";

import useFirma from "./utils/wallet";
import { rootState } from "./redux/reducers";
import { SessionTimer } from "./utils/sessionTimer";
import { walletActions } from "./redux/action";
import { getRandomKey } from "./utils/keyBridge";

import Sidebar from "./organisms/sidebar";
import Header from "./organisms/header";
import Footer from "./organisms/footer";
import LoginCard from "./organisms/login";

import "./default.css";
import theme from "./themes";
import { RightContainer, MainContainer } from "./styles/common";

const App = () => {
  const { isLedger } = useSelector((state: rootState) => state.wallet);
  const { isValidWallet, initWallet } = useFirma();

  SessionTimer(() => {
    if (isLedger === false) {
      walletActions.handleWalletTimeKey(getRandomKey());
      initWallet(false);
    }
  });

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        {isValidWallet() === false && <LoginCard />}
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
