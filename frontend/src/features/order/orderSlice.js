
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api'; 
import { orderProcessedSuccessfully } from '../cart/cartSlice'; 
import { showNotification } from '../notifications/notificationsSlice';


export const createOrderFromCart = createAsyncThunk(
  'orders/createOrder',
  async ({ shippingAddressId, billingAddressId, paymentMethod }, { getState, dispatch, rejectWithValue }) => {
    try {
      const { auth, cart } = getState(); 
      if (!auth.user?.id) {
        dispatch(showNotification({ message: 'Usuario no autenticado para procesar el pedido.', severity: 'error' }));
        return rejectWithValue('Usuario no autenticado.');
      }
      if (cart.items.length === 0) {
        dispatch(showNotification({ message: 'El carrito está vacío. Añade productos antes de comprar.', severity: 'warning' }));
        return rejectWithValue('El carrito está vacío. No se puede crear un pedido.');
      }

      
      const requestBody = {
        shippingAddressId,
        billingAddressId,
        paymentMethod 
      };

      
      const response = await api.post('/Order/checkout', requestBody);

      
      dispatch(showNotification({ message: '¡Pedido realizado con éxito! Gracias por tu compra. 🎉', severity: 'success', duration: 5000 }));

      
      dispatch(orderProcessedSuccessfully(response.data));

      return response.data; 
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Error al procesar tu pedido.';
      
      dispatch(showNotification({ message: message, severity: 'error' }));
      return rejectWithValue(message);
    }
  }
);


export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      if (!auth.user?.id) {
        
        return rejectWithValue('Usuario no autenticado para cargar pedidos.');
      }
      const response = await api.get('/Orders'); 
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Error al cargar tus pedidos anteriores.';
      
      dispatch(showNotification({ message: message, severity: 'error' }));
      return rejectWithValue(message);
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    userOrders: [], 
    status: 'idle', 
    error: null,
  },
  reducers: {
    clearUserOrders: (state) => {
      state.userOrders = [];
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(createOrderFromCart.pending, (state) => {
        state.status = 'loading'; 
      })
      .addCase(createOrderFromCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        
        
        state.error = null;
      })
      .addCase(createOrderFromCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      .addCase(fetchUserOrders.pending, (state) => {
        state.status = 'loading'; 
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userOrders = action.payload; 
        state.error = null;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearUserOrders } = orderSlice.actions;

export default orderSlice.reducer;
