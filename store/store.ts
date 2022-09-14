import { configureStore } from "@reduxjs/toolkit";

import mobileMenuReducer from "./reducers/mobileMenuSlice";
// import loadingReducer from "./reducers/loadingSlice";
// import langReducer from "./reducers/langSlice";

const store = configureStore({
  reducer: {
    mobileMenuState: mobileMenuReducer
    // loadingState: loadingReducer
    // lang: langReducer
  }
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
