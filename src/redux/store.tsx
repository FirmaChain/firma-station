import { applyMiddleware, createStore } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/es/storage';
import { thunk } from 'redux-thunk';

import reducers from './reducers';

const persistConfig = {
	key: 'root',
	storage,
	blacklist: ['modal']
};

export default createStore(persistReducer(persistConfig, reducers), applyMiddleware(thunk));
