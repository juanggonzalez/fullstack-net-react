import { isAsyncThunkAction } from '@reduxjs/toolkit';
import { showNotification } from '../../features/notifications/notificationsSlice';

const notificationMiddleware = (store) => (next) => (action) => {
  
  if (isAsyncThunkAction(action)) {
    
    if (action.type.endsWith('/fulfilled')) {
      const message = action.payload?.message || 'Operación exitosa.';
      store.dispatch(showNotification({ message, severity: 'success' }));
    }

    
    if (action.type.endsWith('/rejected')) {
      const errorMessage =
        action.payload?.message || 
        action.error?.message ||   
        'Ha ocurrido un error inesperado.'; 

      store.dispatch(showNotification({ message: errorMessage, severity: 'error', duration: 6000 }));
    }
  }

  return next(action);
};

export default notificationMiddleware;
