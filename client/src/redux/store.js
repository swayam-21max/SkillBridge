// store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice'; // Give it a more descriptive name

export const store = configureStore({
  reducer: {
    // This is now a valid reducer function 👍
    user: userReducer,
  },
});