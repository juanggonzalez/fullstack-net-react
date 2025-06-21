import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { store } from './app/store';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles'; // Importa ThemeProvider
import CssBaseline from '@mui/material/CssBaseline'; // Importa CssBaseline para estilos base
import theme from './theme'; // Importa tu tema personalizado

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}> {/* Envuelve con ThemeProvider */}
        <CssBaseline /> {/* Resetea CSS y aplica estilos base de MUI */}
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
);