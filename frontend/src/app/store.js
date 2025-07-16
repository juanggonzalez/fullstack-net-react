import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../features/products/productsSlice'; 
import authReducer from '../features/auth/authSlice'; 
import cartReducer from '../features/cart/cartSlice';
import notificationsReducer from '../features/notifications/notificationsSlice'; 
import notificationMiddleware from './middlewares/notificationMiddleware'; 

export const store = configureStore({
  reducer: {
    products: productsReducer,
    auth: authReducer, 
    cart: cartReducer,
    notifications: notificationsReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(notificationMiddleware),
});