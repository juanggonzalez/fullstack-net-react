// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import api from '../../services/api'; // <--- Importa la instancia de Axios configurada

// Helper para obtener el token del localStorage
const getToken = () => localStorage.getItem('token');
const getUser = () => {
  const user = localStorage.getItem('user');
  try {
    return user ? JSON.parse(user) : null;
  } catch (e) {
    // Manejar el caso si el JSON en localStorage está corrupto
    console.error("Error parsing user from localStorage:", e);
    localStorage.removeItem('user'); // Limpiar dato corrupto
    return null;
  }
};

// Acción asíncrona para el login
export const login = createAsyncThunk(
  'auth/login',
  async ({ username, password }, thunkAPI) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      const { token, user } = response.data;

      // Guarda el token y la información del usuario en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      return { token, user };
    } catch (error) {
      // Devuelve el error.message para que sea manejado por el reducer
      // El interceptor de api.js ya asegura que error.message sea una cadena simple.
      return thunkAPI.rejectWithValue(error.message); 
    }
  }
);

// Acción asíncrona para el registro
export const register = createAsyncThunk(
  'auth/register',
  async ({ username, password, confirmPassword, email, firstName, lastName }, thunkAPI) => {
    try {
      const response = await api.post('/auth/register', { username, password, confirmPassword, email, firstName, lastName });
      return response.data; // `response.data` debería ser un objeto con un mensaje de éxito.
    } catch (error) {
      // Devuelve el error.message para que sea manejado por el reducer
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Define una acción para limpiar errores si lo necesitas en algún componente
export const clearError = createAction('auth/clearError');

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: getToken(),
    user: getUser(),
    isAuthenticated: !!getToken(), // true si hay token
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
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
    [clearError]: (state) => { // Reducer para la acción clearError
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
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
        state.error = action.payload; // <--- ERROR ESTABA AQUÍ: action.payload ahora es una cadena gracias a thunkAPI.rejectWithValue(error.message)
                                       // No debería necesitar .message si rejectWithValue ya envió solo el mensaje
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null; // Registro exitoso, no hay error
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload; // <--- ERROR ESTABA AQUÍ: action.payload ahora es una cadena gracias a thunkAPI.rejectWithValue(error.message)
      });
  },
});

export const { logout, clearAuth } = authSlice.actions; // También exporta clearAuth si lo necesitas
export default authSlice.reducer;