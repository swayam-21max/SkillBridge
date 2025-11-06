// client/src/redux/coursesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const fetchCourses = createAsyncThunk(
  'courses/fetchCourses',
  async (_, { rejectWithValue }) => {
    try {
      // FIX: Changed '/courses' to '/courses' (already correct)
      const response = await api.get('/courses');
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
      // FIX: Changed '/api/courses/${courseId}' to '/courses/${courseId}'
      const response = await api.get(`/courses/${courseId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// ... (rest of the file is the same)

const coursesSlice = createSlice({
  name: 'courses',
  initialState: {
    all: [],
    selectedCourse: null, // <-- 2. ADD NEW STATE
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    selectedStatus: 'idle',
    error: null,
  },
  reducers: {
    // We will add filter and sort reducers here later
    clearSelectedCourse: (state) => { // <-- 3. ADD A CLEARING REDUCER
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
      // --- 4. ADD EXTRA REDUCERS ---
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

export const { clearSelectedCourse } = coursesSlice.actions; // <-- 5. EXPORT REDUCER
export default coursesSlice.reducer;