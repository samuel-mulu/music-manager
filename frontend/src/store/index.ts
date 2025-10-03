import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";

import songsReducer from "../features/songs/songsSlice";
import rootSaga from "./rootSaga";

// 1. Create Saga middleware
const sagaMiddleware = createSagaMiddleware();

// 2. Create store
const store = configureStore({
  reducer: {
    songs: songsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

// 3. Run saga
sagaMiddleware.run(rootSaga);

// 4. Export store + types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
