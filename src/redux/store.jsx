import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { persistReducer } from "redux-persist";
import ReduxThunk from "redux-thunk";
import storage from "redux-persist/lib/storage";

import reducers from "./reducers";

const persistConfig = {
  key: "root",
  storage,
};

export default createStore(persistReducer(persistConfig, reducers), composeWithDevTools(applyMiddleware(ReduxThunk)));
