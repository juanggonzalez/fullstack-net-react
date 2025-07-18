
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/Cart');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Error de red al cargar el carrito.');
    }
  }
);

export const syncCart = createAsyncThunk(
  'cart/syncCart',
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    const currentCartItems = state.cart.items;

    const userId = state.auth.user?.id;

    if (!userId) {
      return rejectWithValue('ID de usuario no disponible para sincronizar el carrito.');
    }

    try {
      const cartDtoToSend = {
        id: 0,
        userId: userId,
        items: currentCartItems.map(item => ({
          id: item.id || 0,
          productId: item.productId,
          productName: item.productName,
          productImageUrl: item.productImageUrl,
          productPrice: item.productPrice,
          quantity: item.quantity
        }))
      };

      const response = await api.put('/Cart/sync', cartDtoToSend);

      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Error al sincronizar el carrito.';
      return rejectWithValue(message);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    status: 'idle', 
    error: null,
    isOpen: false, 
  },
  reducers: {
    addItem: (state, action) => {
      const product = action.payload;
      const existingItem = state.items.find(item => item.productId === product.id);

      if (existingItem) {
        existingItem.quantity++;
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          id: 0,
          productId: product.id,
          productName: product.name,
          productImageUrl: product.imageUrl,
          productPrice: product.price,
          quantity: 1
        });
      }
    },
    removeItem: (state, action) => {
      
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    updateItemQuantity: (state, action) => {
      const { id: cartItemId, quantity: newQuantity } = action.payload;
      const itemToUpdate = state.items.find(item => item.id === cartItemId);
      if (itemToUpdate) {
        itemToUpdate.quantity = newQuantity;
        if (itemToUpdate.quantity <= 0) {
          state.items = state.items.filter(item => item.id !== cartItemId);
        }
      }
    },
    clearLocalCart: (state) => {
      state.items = [];
    },
    setCart: (state, action) => {
      state.items = action.payload.items || [];
    },
    openCart: (state) => {
      state.isOpen = true;
    },
    closeCart: (state) => {
      state.isOpen = false;
    },
    
    orderProcessedSuccessfully: (state, action) => {
      state.items = []; 
      
      
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.items || [];
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
        state.items = [];
      })
      .addCase(syncCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(syncCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.items;
      })
      .addCase(syncCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });
  },
});

export const { addItem, removeItem, updateItemQuantity, clearLocalCart, setCart, openCart, closeCart, orderProcessedSuccessfully } = cartSlice.actions;

export default cartSlice.reducer;
