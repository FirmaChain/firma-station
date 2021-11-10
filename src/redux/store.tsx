import { createStore, applyMiddleware } from "redux";
import { persistReducer } from "redux-persist";
import ReduxThunk from "redux-thunk";
import storage from "redux-persist/lib/storage";

import reducers from "./reducers";

const persistConfig = {
  key: "root",
  storage,
  blacklist: ["modal"],
};

export default createStore(persistReducer(persistConfig, reducers), applyMiddleware(ReduxThunk));
