import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Accede a la variable de entorno de Vite
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Acción asíncrona para obtener productos (exportación directa)
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ search = '', categoryId = null, brandId = null, minPrice = null, maxPrice = null, pageNumber = 1, pageSize = 10, sortBy = null } = {}, thunkAPI) => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (categoryId) params.append('categoryId', categoryId);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      params.append('pageNumber', pageNumber);
      params.append('pageSize', pageSize);
      if (sortBy) params.append('sortBy', sortBy);

      // Usa la variable de entorno aquí
      const response = await axios.get(`${API_BASE_URL}/products?${params.toString()}`);
      const totalCount = response.headers['x-total-count'] ? parseInt(response.headers['x-total-count']) : response.data.length;

      return { products: response.data, totalCount };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Acción asíncrona para actualizar el stock (exportación directa)
export const updateProductStock = createAsyncThunk(
  'products/updateProductStock',
  async ({ productId, newStock }, thunkAPI) => {
    try {
      // Usa la variable de entorno aquí
      const response = await axios.patch(`${API_BASE_URL}/products/${productId}/stock`, {
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
  },
  reducers: {
    // Si tuvieras acciones síncronas, se exportarían así:
    // setProductLoading: (state) => { state.status = 'loading'; }
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
          // Asumiendo que la API devuelve el producto actualizado
          state.items[existingProductIndex] = updatedProduct;
        }
      })
      .addCase(updateProductStock.rejected, (state, action) => {
        console.error("Failed to update stock:", action.payload);
      });
  },
});

// Las acciones síncronas del slice (si las hay) se exportan así:
// export const { setProductLoading } = productsSlice.actions;

// El reducer principal del slice se exporta por defecto:
export default productsSlice.reducer;