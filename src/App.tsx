import { useSelector } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";

import { rootState } from "./redux/reducers";
import { getRandomKey } from "./utils/keyBridge";
import { walletActions } from "./redux/action";
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
  const { isNeedLogin, isTimeout } = useFirma();
  const { timeKey } = useSelector((state: rootState) => state.wallet);

  if (isTimeout(timeKey)) {
    walletActions.handleWalletTimeKey(getRandomKey());
  }

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
