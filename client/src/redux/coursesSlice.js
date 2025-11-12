// client/src/redux/coursesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const fetchCourses = createAsyncThunk(
  'courses/fetchCourses',
  // Accepts a params object for search/filter/sort
  async (params = {}, { rejectWithValue }) => {
    try {
      // Use URLSearchParams to correctly format query parameters
      const query = new URLSearchParams(params).toString();
      const response = await api.get(`/courses?${query}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchCourseById = createAsyncThunk(
  'courses/fetchCourseById',
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/courses/${courseId}`);
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
    selectedCourse: null, 
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    selectedStatus: 'idle',
    error: null,
  },
  reducers: {
    clearSelectedCourse: (state) => {
      state.selectedCourse = null;
      state.selectedStatus = 'idle';
    }
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
      })
      .addCase(fetchCourseById.pending, (state) => {
        state.selectedStatus = 'loading';
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.selectedStatus = 'succeeded';
        state.selectedCourse = action.payload;
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.selectedStatus = 'failed';
        state.error = action.payload ? action.payload.error : 'Could not fetch course';
      });
  },
});

export const { clearSelectedCourse } = coursesSlice.actions; 
export default coursesSlice.reducer;