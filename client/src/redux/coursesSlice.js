// client/src/redux/slices/coursesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const fetchCourses = createAsyncThunk(
  'courses/fetchCourses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/courses');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const coursesSlice = createSlice({
  name: 'courses',
  initialState: {
    all: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    // We will add filter and sort reducers here later
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.all = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ? action.payload.error : 'Could not fetch courses';
      });
  },
});

export default coursesSlice.reducer;