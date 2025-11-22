import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

import userReducer from "./userStore";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  // What slices will persist
  whitelist: ["user"],
};

// reducer full of all the slices of reducers
const rootReducer = combineReducers({
  user: userReducer,
});

// Persists the whitelisted slices within the root reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);

// Types for use in components
export type AppRootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
