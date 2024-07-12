import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { thunk } from 'redux-thunk';
import rootReducer from '../store/redux/index'; // 确保 rootReducer 是一个有效的 reducer
/**
 * we use persitedReducer from redux-persist lib here to avoid losing data when browser refresh
 * @type {{storage: WebStorage, key: string}}
 */
const persistConfig = {
    key: 'root',
    storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
    persistedReducer,
    applyMiddleware(thunk)
);

const persistor = persistStore(store);

export { store, persistor };