import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { componentsSlice } from "./componentsSlice";

const store = configureStore({
  reducer: combineReducers({ components: componentsSlice.reducer })
});

if (process.env.NODE_ENV === "development" && module.hot) {
  module.hot.accept("./rootReducer", () => {
    const newRootReducer = require("./rootReducer").default;
    store.replaceReducer(newRootReducer);
  });
}

export type AppDispatch = typeof store.dispatch;

export default store;
