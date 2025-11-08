import { configureStore, combineReducers } from "@reducejs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";

import userReducer from "./userStore";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["user"],
};

const reducer = combineReducers({
  user: userReducer,
});

const persistedReducer = persistReducer(persistConfig, reducer);

const store = configureStore({
  reducer: persistedReducer,
});

export default store;
