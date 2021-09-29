import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { SnackbarProvider } from "notistack";

import App from "./app";

import store from "redux/store";

ReactDOM.render(
  <Provider store={store}>
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
    >
      <App />
    </SnackbarProvider>
  </Provider>,
  document.getElementById("root")
);
