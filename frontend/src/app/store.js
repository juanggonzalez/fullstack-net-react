// src/app/store.js (Ejemplo, tu ruta puede variar)
import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../features/products/productsSlice'; // Tu slice de productos existente
import authReducer from '../features/auth/authSlice'; // <--- Importa el nuevo slice de autenticación

export const store = configureStore({
  reducer: {
    products: productsReducer,
    auth: authReducer, // <--- Añade el reducer de autenticación
  },
});