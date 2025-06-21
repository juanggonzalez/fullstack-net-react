// src/services/api.js
import axios from 'axios';

// Define la URL base de tu API
// Asegúrate de que este puerto sea el correcto para tu backend .NET
const API_BASE_URL = 'https://localhost:7224/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para inyectar el token JWT en cada solicitud (si existe)
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

// Interceptor para manejar errores de respuesta de la API
api.interceptors.response.use(
  (response) => {
    // Si la respuesta es exitosa, simplemente la devolvemos
    return response;
  },
  (error) => {
    // Aquí es donde procesamos los errores
    let errorMessage = 'Ocurrió un error inesperado.'; // Mensaje genérico

    if (error.response) {
      // El servidor respondió con un estado fuera del rango 2xx
      const { data, status } = error.response;

      if (status === 400 && data.errors) {
        // Errores de validación de modelo (Model State Errors) de ASP.NET Core
        // Estos suelen venir en un formato { "campo": ["error1", "error2"] }
        const validationErrors = Object.values(data.errors).flat(); // Aplana todos los mensajes de error
        errorMessage = validationErrors.join('; '); // Une los mensajes
        if (validationErrors.length > 1) {
            errorMessage = "Errores de validación: " + errorMessage;
        } else if (validationErrors.length === 1){
            errorMessage = validationErrors[0]; // Si es solo un error, mostrarlo directamente
        }
      } else if (data.title) {
        // Otros errores personalizados con un 'title' (ej: Identity errors)
        errorMessage = data.title;
      } else if (data.message) {
        // Mensajes de error generales o de API
        errorMessage = data.message;
      } else if (typeof data === 'string' && data.length > 0) {
        // A veces el backend puede enviar un string simple como error
        errorMessage = data;
      } else {
        // Mensaje por defecto para errores de servidor que no tienen un formato específico
        errorMessage = `Error del servidor: ${status}`;
      }
    } else if (error.request) {
      // La solicitud fue hecha pero no se recibió respuesta (ej: red caída, CORS)
      errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión.';
    } else {
      // Algo sucedió al configurar la solicitud que disparó un error
      errorMessage = error.message;
    }

    // Devolvemos un Promise.reject con el mensaje de error procesado
    return Promise.reject({ message: errorMessage, originalError: error });
  }
);

export default api;