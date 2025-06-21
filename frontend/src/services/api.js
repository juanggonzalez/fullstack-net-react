import axios from 'axios';

const API_BASE_URL = 'https://localhost:7224/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    let errorMessage = 'Ocurrió un error inesperado.'; 

    if (error.response) {
      const { data, status } = error.response;

      if (status === 400 && data.errors) {
        const validationErrors = Object.values(data.errors).flat(); 
        errorMessage = validationErrors.join('; '); 
        if (validationErrors.length > 1) {
            errorMessage = "Errores de validación: " + errorMessage;
        } else if (validationErrors.length === 1){
            errorMessage = validationErrors[0]; 
        }
      } else if (data.title) {
        errorMessage = data.title;
      } else if (data.message) {
        errorMessage = data.message;
      } else if (typeof data === 'string' && data.length > 0) {
        errorMessage = data;
      } else {
        errorMessage = `Error del servidor: ${status}`;
      }
    } else if (error.request) {
      errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión.';
    } else {
      errorMessage = error.message;
    }

    return Promise.reject({ message: errorMessage, originalError: error });
  }
);

export default api;