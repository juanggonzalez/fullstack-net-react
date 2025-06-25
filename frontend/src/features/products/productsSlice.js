// productsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api'; 


export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ search = '', categoryId = null, brandId = null, minPrice = null, maxPrice = null, pageNumber = 1, pageSize = 10, sortBy = null } = {}, thunkAPI) => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (categoryId) params.append('categoryId', categoryId);
      if (brandId) params.append('brandId', brandId); 
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      params.append('pageNumber', pageNumber);
      params.append('pageSize', pageSize);
      if (sortBy) params.append('sortBy', sortBy);

      const response = await api.get(`/products?${params.toString()}`); 
      const totalCount = response.headers['x-total-count'] ? parseInt(response.headers['x-total-count']) : response.data.length;

      return { products: response.data, totalCount };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (productId, thunkAPI) => {
    try {
      const response = await api.get(`/products/${productId}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateProductStock = createAsyncThunk(
  'products/updateProductStock',
  async ({ productId, newStock }, thunkAPI) => {
    try {
      const response = await api.patch(`/products/${productId}/stock`, {
        id: productId, 
        newStock: newStock
      });
      return response.data; 
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);


const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    totalCount: 0,
    status: 'idle', 
    error: null,
    currentProduct: null, // Nuevo estado para el producto individual
    currentProductStatus: 'idle', // Estado de carga para el producto individual
    currentProductError: null, // Errores para el producto individual
  },
  reducers: {
    
  },
  extraReducers(builder) {
    builder
      .addCase(fetchProducts.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.products;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload; 
      })
      .addCase(updateProductStock.fulfilled, (state, action) => {
        const updatedProduct = action.payload;
        const existingProductIndex = state.items.findIndex(p => p.id === updatedProduct.id);
        if (existingProductIndex !== -1) {
          state.items[existingProductIndex] = updatedProduct;
        }
      })
      // Nuevos casos para fetchProductById
      .addCase(fetchProductById.pending, (state) => {
        state.currentProductStatus = 'loading';
        state.currentProductError = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.currentProductStatus = 'succeeded';
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.currentProductStatus = 'failed';
        state.currentProductError = action.payload;
        state.currentProduct = null;
      });
  }
});

export default productsSlice.reducer;