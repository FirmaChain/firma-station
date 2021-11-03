import { createStore, applyMiddleware, compose } from "redux";
import { persistReducer } from "redux-persist";
import ReduxThunk from "redux-thunk";
import storage from "redux-persist/lib/storage";

import reducers from "./reducers";

const persistConfig = {
  key: "root",
  storage,
};

export default createStore(
  persistReducer(persistConfig, reducers),
  compose(
    applyMiddleware(ReduxThunk),
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__()
  )
);
