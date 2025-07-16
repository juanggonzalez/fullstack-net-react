import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196F3', // Un azul brillante y moderno (Material Blue 500)
      light: '#64B5F6',
      dark: '#1976D2', // Un azul más oscuro para contrastes y AppBar
      contrastText: '#fff',
    },
    secondary: {
      main: '#4CAF50', // Un verde natural y amigable (Material Green 500)
      light: '#81C784',
      dark: '#388E3C',
      contrastText: '#fff',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#F0F2F5', // Un gris muy claro, casi blanco, para fondos generales
      paper: '#FFFFFF',  // Blanco puro para las superficies de los componentes (tarjetas, filtros)
    },
    text: {
      primary: '#333333', // Gris oscuro para texto principal
      secondary: '#666666', // Gris medio para texto secundario
    },
    gradients: {
      primaryToSecondary: 'linear-gradient(135deg, #64B5F6 0%, #81C784 100%)', // Usando los colores light
    },
  },
  typography: {
    fontFamily: 'Roboto, "Helvetica Neue", Arial, sans-serif',
    h4: {
      fontWeight: 700, 
      color: '#333333',
    },
    h6: {
      fontWeight: 600,
    },
    subtitle1: {
      color: '#666666',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none', // Botones sin transformación a mayúsculas
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.08)', // Sombra ligeramente más pronunciada
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        }
      }
    },
    MuiPaper: { // Estilos para el Paper que envuelve los filtros
      styleOverrides: {
        root: {
          boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.08)',
        }
      }
    }
  }
});

export default theme;