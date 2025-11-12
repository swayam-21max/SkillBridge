// store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import authReducer from './authSlice';
import coursesReducer from './coursesSlice';
import enrollmentReducer from './enrollmentSlice';
import skillsReducer from './skillsSlice'; // <-- 1. IMPORT NEW REDUCER

export const store = configureStore({
  reducer: {
    user: userReducer,
    auth: authReducer,
    courses: coursesReducer,
    enrollments: enrollmentReducer,
    skills: skillsReducer, // <-- 2. ADD NEW REDUCER
  },
});