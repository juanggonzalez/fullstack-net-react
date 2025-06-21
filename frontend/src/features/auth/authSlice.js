import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import api from '../../services/api'; 

const getToken = () => localStorage.getItem('token');
const getUser = () => {
  const user = localStorage.getItem('user');
  try {
    return user ? JSON.parse(user) : null;
  } catch (e) {
    
    console.error("Error parsing user from localStorage:", e);
    localStorage.removeItem('user'); 
    return null;
  }
};

export const login = createAsyncThunk(
  'auth/login',
  async ({ username, password }, thunkAPI) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      return { token, user };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message); 
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async ({ username, password, confirmPassword, email, firstName, lastName }, thunkAPI) => {
    try {
      const response = await api.post('/auth/register', { username, password, confirmPassword, email, firstName, lastName });
      return response.data; 
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const clearError = createAction('auth/clearError');

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: getToken(),
    user: getUser(),
    isAuthenticated: !!getToken(),
    status: 'idle', 
    error: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.status = 'idle';
      state.error = null;
    },
    clearAuth: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.status = 'idle';
      state.error = null;
    },
    [clearError]: (state) => { 
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(register.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null; 
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload; 
      });
  },
});

export const { logout, clearAuth } = authSlice.actions; 
export default authSlice.reducer;