// client/src/redux/skillsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

// --- Thunk to fetch all available skills (categories) ---
export const fetchSkills = createAsyncThunk(
  'skills/fetchSkills',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/skills'); // Using the new public route
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const skillsSlice = createSlice({
  name: 'skills',
  initialState: {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSkills.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSkills.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchSkills.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.error || 'Failed to fetch skills';
      });
  },
});

export default skillsSlice.reducer;