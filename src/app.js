import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";

import Sidebar from "organisms/sidebar";
import Header from "organisms/header";
import Footer from "organisms/footer";

import { RightContainer, MainContainer } from "styles/common";

import Routes from "routes";
import "app.css";
import "i18n";

import theme from "themes";

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
