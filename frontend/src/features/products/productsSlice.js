// src/features/products/productsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api'; // <--- Importa la instancia de Axios configurada

// No necesitamos API_BASE_URL aquí si siempre usamos la instancia 'api'

// Acción asíncrona para obtener productos
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ search = '', categoryId = null, brandId = null, minPrice = null, maxPrice = null, pageNumber = 1, pageSize = 10, sortBy = null } = {}, thunkAPI) => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (categoryId) params.append('categoryId', categoryId);
      if (brandId) params.append('brandId', brandId); // Agregado brandId
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      params.append('pageNumber', pageNumber);
      params.append('pageSize', pageSize);
      if (sortBy) params.append('sortBy', sortBy);

      const response = await api.get(`/products?${params.toString()}`); // Usa 'api.get'
      const totalCount = response.headers['x-total-count'] ? parseInt(response.headers['x-total-count']) : response.data.length;

      return { products: response.data, totalCount };
    } catch (error) {
      // Captura el error para que Redux lo maneje
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Acción asíncrona para actualizar el stock de un producto
export const updateProductStock = createAsyncThunk(
  'products/updateProductStock',
  async ({ productId, newStock }, thunkAPI) => {
    try {
      // Asegúrate de que tu backend espera el cuerpo correcto para la actualización de stock
      // En tu ProductsController.cs, el método Patch espera ProductStockUpdateDto que tiene Id y NewStock
      const response = await api.patch(`/products/${productId}/stock`, {
        id: productId, // Asegúrate de enviar el ID en el cuerpo si el DTO lo requiere
        newStock: newStock
      });
      // Devuelve el producto actualizado o un indicador de éxito
      return response.data; // O simplemente productId para indicar éxito
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
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    // Si tuvieras acciones síncronas, se exportarían así:
    // setProductLoading: (state) => { state.status = 'loading'; }
  },
  extraReducers(builder) {
    builder
      // Casos para fetchProducts
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
        state.error = action.payload; // El payload es el error que devolvimos con rejectWithValue
      })
      // Casos para updateProductStock
      .addCase(updateProductStock.fulfilled, (state, action) => {
        const updatedProduct = action.payload;
        // Asumiendo que la API devuelve el producto actualizado o al menos el ID
        const existingProductIndex = state.items.findIndex(p => p.id === updatedProduct.id);
        if (existingProductIndex !== -1) {
          // Si la API devuelve el producto completo actualizado
          state.items[existingProductIndex] = updatedProduct;
        }
        // Si la API solo devuelve éxito y necesitas actualizar el stock localmente sin refetch
        // Puedes encontrar el producto por ID y actualizar su stock:
        // const productToUpdate = state.items.find(p => p.id === updatedProduct.id);
        // if (productToUpdate) {
        //    productToUpdate.stock = updatedProduct.newStock; // O el nombre de la propiedad de stock
        // }
      })
      .addCase(updateProductStock.rejected, (state, action) => {
        console.error("Failed to update stock:", action.payload);
        // Aquí podrías guardar el error en el estado si lo deseas, o mostrar una notificación
      });
  },
});

export default productsSlice.reducer;