// client/src/redux/enrollmentSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

// --- Thunk to fetch all enrollments for the LOGGED IN user ---
export const fetchEnrollments = createAsyncThunk(
  'enrollments/fetchEnrollments',
  async (_, { rejectWithValue }) => {
    try {
      // FIX: Changed '/api/enrollments/user' to '/enrollments/user'
      const response = await api.get('/enrollments/user');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// --- Thunk to enroll in a new course ---
export const enrollInCourse = createAsyncThunk(
  'enrollments/enrollInCourse',
  async (courseId, { rejectWithValue }) => {
    try {
      // FIX: Changed '/api/enrollments' to '/enrollments'
      const response = await api.post('/enrollments', { courseId });
      return response.data.enrollment; 
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const enrollmentSlice = createSlice({
  name: 'enrollments',
  initialState: {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Enrollments
      .addCase(fetchEnrollments.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEnrollments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchEnrollments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.error;
      })
      // Enroll in Course
      .addCase(enrollInCourse.pending, (state) => {
        // You could set an 'enrolling' status here if you want
      })
      .addCase(enrollInCourse.fulfilled, (state, action) => {
        // Add the new enrollment (which includes the course details)
        state.items.push(action.payload);
      })
      .addCase(enrollInCourse.rejected, (state, action) => {
        // Set an error to be displayed
        state.error = action.payload?.error || 'Enrollment failed';
      });
  },
});

export default enrollmentSlice.reducer;