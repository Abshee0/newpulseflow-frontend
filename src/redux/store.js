// store.js
import { configureStore } from "@reduxjs/toolkit";
import boardsReducer from "./boardsSlice"; // Ensure correct path

const store = configureStore({
  reducer: {
    boards: boardsReducer, // Ensure the reducer is correctly provided here
  },
});

export default store;
