import { createAction, createReducer } from "@reduxjs/toolkit";

const increment = createAction("INCREMENT");
const decrement = createAction("DECREMENT");

export const rootReducer = createReducer(0, {
  [increment.type]: state => state + 1,
  [decrement.type]: state => state - 1
});
