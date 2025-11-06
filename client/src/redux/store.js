// store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import authReducer from './authSlice';
import coursesReducer from './coursesSlice';
import enrollmentReducer from './enrollmentSlice'; // <-- 1. IMPORT

export const store = configureStore({
  reducer: {
    // This is now a valid reducer function 👍
    user: userReducer,
    auth: authReducer,
    courses: coursesReducer,
    enrollments: enrollmentReducer, // <-- 2. ADD IT HERE
  },
});
