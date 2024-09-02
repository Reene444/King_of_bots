import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import sessionStorage from 'redux-persist/lib/storage/session';
import { thunk } from 'redux-thunk';
import rootReducer from './redux/index'; // 确保 rootReducer 是一个有效的 reducer
/**
 * we use persitedReducer from redux-persist lib here to avoid losing data when browser refresh
 * @type {{storage: WebStorage, key: string}}
 */
const persistConfig = {
    key: 'root',
    storage:sessionStorage
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
    persistedReducer,
    applyMiddleware(thunk)
);

const persistor = persistStore(store);
console.log('Storage engine:', persistConfig.storage === sessionStorage ? 'sessionStorage' : 'other'); // 添加此行进行日志记录

export { store, persistor };