// store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import authReducer from './authSlice';


export const store = configureStore({
  reducer: {
    // This is now a valid reducer function 👍
    user: userReducer,
    auth:authReducer,
     
  },
});