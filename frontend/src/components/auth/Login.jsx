// src/components/auth/Login.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper, // Import Paper
  Snackbar, // Import Snackbar
  Alert, // Import Alert for Snackbar content
  Slide, // Import Slide for Snackbar transition
  useTheme, // Import useTheme to access palette colors
} from '@mui/material';
import { motion } from 'framer-motion'; // Import framer-motion

// Función de transición para el Snackbar (opcional, pero añade suavidad)
function TransitionLeft(props) {
  return <Slide {...props} direction="left" />;
}

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme(); // Hook para acceder al tema de Material-UI

  const { status, error, isAuthenticated } = useSelector((state) => state.auth);

  // Estados para controlar el Snackbar (toast)
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info'); // 'success', 'error', 'warning', 'info'

  // Efecto para redirigir en caso de autenticación exitosa
  useEffect(() => {
    if (isAuthenticated) {
      setSnackbarMessage('¡Inicio de sesión exitoso!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      // Retrasa la navegación ligeramente para que el toast sea visible
      setTimeout(() => {
        navigate('/');
      }, 1500); // 1.5 segundos
    }
  }, [isAuthenticated, navigate]);

  // Efecto para mostrar errores del API en el Snackbar
  useEffect(() => {
    if (status === 'failed' && error) {
      setSnackbarMessage(error.title || error.message || 'Error al iniciar sesión. Verifica tus credenciales.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  }, [status, error]);

  // Manejador del envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validación básica antes de enviar la solicitud
    if (username.trim() === '' || password.trim() === '') {
        setSnackbarMessage('Por favor, ingresa tu nombre de usuario y contraseña.');
        setSnackbarSeverity('warning');
        setSnackbarOpen(true);
        return;
    }
    // Dispara la acción asíncrona de login
    dispatch(login({ username, password }));
  };

  // Manejador para cerrar el Snackbar
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  // Define un fondo de gradiente sutil usando colores de la paleta del tema
  const gradientBackground = `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.light} 100%)`;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: gradientBackground, // Aplica el gradiente de fondo
        p: 2, // Padding general para asegurar que no toque los bordes en pantallas pequeñas
      }}
    >
      {/* Animación de entrada para el contenedor del formulario */}
      <motion.div
        initial={{ opacity: 0, y: -50 }} // Empieza invisible y ligeramente arriba
        animate={{ opacity: 1, y: 0 }}   // Anima a visible y a su posición
        transition={{ duration: 0.5 }}   // Duración de la animación
      >
        <Paper
          elevation={6} // Elevación para dar un efecto 3D
          sx={{
            p: 4, // Padding interno del Paper
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            maxWidth: '400px', // Ancho máximo para el formulario
            width: '100%',
            borderRadius: '12px', // Bordes redondeados
            boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.2)', // Sombra más pronunciada
            background: theme.palette.background.paper, // Usa el color de fondo de Paper del tema
          }}
        >
          <Typography component="h1" variant="h5" sx={{ mb: 2, color: theme.palette.primary.main }}>
            Iniciar Sesión
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Nombre de Usuario"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              variant="outlined" // Estilo de borde del TextField
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.2, fontSize: '1.1rem' }} // Botón más grande y con más padding vertical
              disabled={status === 'loading'} // Deshabilita el botón mientras carga
            >
              {status === 'loading' ? 'Iniciando sesión...' : 'Login'}
            </Button>
            <Button
              fullWidth
              variant="text"
              onClick={() => navigate('/register')}
              sx={{ color: theme.palette.text.secondary }} // Color de texto secundario del tema
            >
              ¿No tienes cuenta? Regístrate
            </Button>
          </Box>
        </Paper>
      </motion.div>

      {/* Snackbar para mostrar mensajes de éxito/error/advertencia */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000} // Duración del toast
        onClose={handleSnackbarClose}
        TransitionComponent={TransitionLeft} // Animación de entrada
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} // Posición del toast
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login;