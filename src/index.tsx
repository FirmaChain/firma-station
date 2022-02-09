import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { SnackbarProvider } from "notistack";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

import App from "./App";
import store from "./redux/store";
import { ApolloProvider, client } from "./apollo";

const persistor = persistStore(store);

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ApolloProvider client={client}>
        <SnackbarProvider
          maxSnack={3}
          style={{ fontSize: "1.2rem" }}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
        >
          <App />
        </SnackbarProvider>
      </ApolloProvider>
    </PersistGate>
  </Provider>,
  document.getElementById("root")
);
