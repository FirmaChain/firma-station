import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";

import Routes from "./routes";

import theme from "./themes";

import Sidebar from "./organisms/sidebar";
import Header from "./organisms/header";
import Footer from "./organisms/footer";

import { RightContainer, MainContainer } from "./styles/common";

import "./App.css";

const App = () => (
  <BrowserRouter>
    <ThemeProvider theme={theme}>
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

export default App;
