// userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: { value: null },
  reducers: {
    // your reducer functions here
  },
});

// CORRECT: Export the reducer property specifically
export default userSlice.reducer;