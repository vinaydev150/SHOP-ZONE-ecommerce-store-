import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await API.post('/auth/login', credentials);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Login failed'
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await API.post('/auth/register', userData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Registration failed'
      );
    }
  }
);

const token = localStorage.getItem('token');
const user  = JSON.parse(localStorage.getItem('user') || 'null');

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user:    user  || null,
    token:   token || null,
    loading: false,
    error:   null,
  },
  reducers: {
    logout: (state) => {
      state.user  = null;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state) => {
      state.loading = true;
      state.error   = null;
    };
    const handleFulfilled = (state, action) => {
      state.loading = false;
      state.user    = action.payload;
      state.token   = action.payload.token;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload));
    };
    const handleRejected = (state, action) => {
      state.loading = false;
      state.error   = action.payload;
    };

    builder
      .addCase(loginUser.pending,      handlePending)
      .addCase(loginUser.fulfilled,    handleFulfilled)
      .addCase(loginUser.rejected,     handleRejected)
      .addCase(registerUser.pending,   handlePending)
      .addCase(registerUser.fulfilled, handleFulfilled)
      .addCase(registerUser.rejected,  handleRejected);
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;