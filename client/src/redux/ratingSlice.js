// client/src/redux/ratingSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

// --- Thunk to fetch all ratings for a course ---
export const fetchRatingsByCourseId = createAsyncThunk(
  'ratings/fetchRatings',
  async (courseId, { rejectWithValue }) => {
    try {
      // FIX: Changed '/api/courses/${courseId}/ratings' to '/courses/${courseId}/ratings'
      const response = await api.get(`/courses/${courseId}/ratings`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// --- Thunk to submit a new rating ---
export const submitRating = createAsyncThunk(
  'ratings/submitRating',
  async ({ courseId, rating, comment }, { rejectWithValue }) => {
    try {
      // FIX: Changed '/api/ratings' to '/ratings'
      const response = await api.post('/ratings', { courseId, rating, comment });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// ... (rest of the file is the same)

const ratingSlice = createSlice({
  name: 'ratings',
  initialState: {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    submitStatus: 'idle',
    error: null,
    submitError: null,
  },
  reducers: {
    clearRatings: (state) => {
      state.items = [];
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Ratings
      .addCase(fetchRatingsByCourseId.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRatingsByCourseId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchRatingsByCourseId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.error;
      })
      // Submit Rating
      .addCase(submitRating.pending, (state) => {
        state.submitStatus = 'loading';
        state.submitError = null;
      })
      .addCase(submitRating.fulfilled, (state, action) => {
        state.submitStatus = 'succeeded';
        state.items.unshift(action.payload); // Add new rating to the top
      })
      .addCase(submitRating.rejected, (state, action) => {
        state.submitStatus = 'failed';
        state.submitError = action.payload.error;
      });
  },
});

export const { clearRatings } = ratingSlice.actions;
export default ratingSlice.reducer;