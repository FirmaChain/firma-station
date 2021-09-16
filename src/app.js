import React from "react";
import { BrowserRouter } from "react-router-dom";

import Sidebar from "./components/sidebar";

import { RightContainer, MainContainer } from "./styles/common";

import Routes from "./routes";
import "./app.css";

const App = () => (
  <BrowserRouter>
    <MainContainer>
      <Sidebar />
      <RightContainer>
        <Routes />
      </RightContainer>
    </MainContainer>
  </BrowserRouter>
);

export default App;
