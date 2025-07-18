import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../features/products/productsSlice'; 
import authReducer from '../features/auth/authSlice'; 
import cartReducer from '../features/cart/cartSlice';
import notificationsReducer from '../features/notifications/notificationsSlice'; 
import notificationMiddleware from './middlewares/notificationMiddleware'; 
import orderReducer from '../features/order/orderSlice'
export const store = configureStore({
  reducer: {
    products: productsReducer,
    auth: authReducer, 
    cart: cartReducer,
    notifications: notificationsReducer,
    order: orderReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(notificationMiddleware),
});