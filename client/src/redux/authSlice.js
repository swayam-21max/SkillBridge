// client/src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api'; 

// --- Async Thunk for User Registration (Now includes Trainer OTP flow) ---
export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/signup', userData);
      
      // If trainer signup is initiated, the response will contain a trainer object
      if (userData.role === 'trainer' && !response.data.user?.isVerified) {
        return { message: response.data.message, trainerEmail: response.data.trainer.email, role: 'trainer', status: 'otp_pending' };
      }

      // Default learner success flow
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return { message: response.data.message, user: response.data.user, status: 'logged_in' };
      
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// --- Async Thunk for OTP Verification (New) ---
export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/verify-otp', { email, otp });
      
      // On successful verification, store the new token and user info
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// --- Async Thunk for User Login (Unchanged logic, just updated status response) ---
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', userData);
      // On success, store the token and user info in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Get user info from localStorage if it exists
const user = JSON.parse(localStorage.getItem('user'));
const token = localStorage.getItem('token');

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: user || null,
    token: token || null,
    isLoading: false,
    error: null,
    // --- NEW STATE FOR TRAINER OTP FLOW ---
    isOtpSent: false,
    otpEmail: null,
    signupStatus: 'idle', // 'idle' | 'otp_pending' | 'success'
    // --------------------------------------
  },
  reducers: {
    // Logout reducer
    logout: (state) => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      state.user = null;
      state.token = null;
      // Reset OTP status on logout
      state.isOtpSent = false; 
      state.otpEmail = null;
      state.signupStatus = 'idle';
    },
    resetSignupState: (state) => {
        state.isOtpSent = false;
        state.otpEmail = null;
        state.signupStatus = 'idle';
        state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Signup actions
      .addCase(signupUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.isLoading = false;
        
        if (action.payload.status === 'otp_pending') {
            // Trainer OTP flow initiated
            state.isOtpSent = true;
            state.otpEmail = action.payload.trainerEmail;
            state.signupStatus = 'otp_pending';
            state.error = null;
        } else {
            // Learner logged in immediately
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.signupStatus = 'success';
        }
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.error;
      })
      
      // Verify OTP actions (New)
      .addCase(verifyOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isOtpSent = false;
        state.otpEmail = null;
        state.signupStatus = 'success';
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.error;
      })
      
      // Login actions
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        // Reset trainer flow flags if trying to log in
        state.isOtpSent = false;
        state.otpEmail = null;
        state.signupStatus = 'idle';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.error;
        
        // If login fails because trainer is unverified, push to OTP flow
        if (action.payload.error && action.payload.error.includes("not verified")) {
             state.isOtpSent = true; // Pretend OTP was re-sent
             state.otpEmail = action.meta.arg.email; // Use email from login form
             state.signupStatus = 'otp_pending';
             state.error = action.payload.error;
        }
      });
  },
});

export const { logout, resetSignupState } = authSlice.actions;
export default authSlice.reducer;