import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../features/products/productsSlice';
// Importa aquí otros reducers si los creas más adelante, ej:
// import authReducer from '../features/auth/authSlice';
// import cartReducer from '../features/cart/cartSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    // Añade aquí otros reducers, ej:
    // auth: authReducer,
    // cart: cartReducer,
  },
});