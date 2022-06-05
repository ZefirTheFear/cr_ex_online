import { configureStore } from "@reduxjs/toolkit";

import mobileMenuReducer from "./reducers/mobileMenuSlice";

const store = configureStore({
  reducer: {
    mobileMenuState: mobileMenuReducer
  }
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
