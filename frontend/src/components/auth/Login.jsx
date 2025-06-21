import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper, 
  Snackbar, 
  Alert, 
  Slide, 
  useTheme, 
} from '@mui/material';
import { motion } from 'framer-motion'; 

function TransitionLeft(props) {
  return <Slide {...props} direction="left" />;
}

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme(); 

  const { status, error, isAuthenticated } = useSelector((state) => state.auth);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info'); 

  useEffect(() => {
    if (isAuthenticated) {
      setSnackbarMessage('¡Inicio de sesión exitoso!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setTimeout(() => {
        navigate('/');
      }, 1500); 
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (status === 'failed' && error) {
      setSnackbarMessage(error.title || error.message || 'Error al iniciar sesión. Verifica tus credenciales.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  }, [status, error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username.trim() === '' || password.trim() === '') {
        setSnackbarMessage('Por favor, ingresa tu nombre de usuario y contraseña.');
        setSnackbarSeverity('warning');
        setSnackbarOpen(true);
        return;
    }
    dispatch(login({ username, password }));
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const gradientBackground = `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.light} 100%)`;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: gradientBackground, 
        p: 2, 
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -50 }} 
        animate={{ opacity: 1, y: 0 }}   
        transition={{ duration: 0.5 }}   
      >
        <Paper
          elevation={6} 
          sx={{
            p: 4, 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            maxWidth: '400px', 
            width: '100%',
            borderRadius: '12px', 
            boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.2)', 
            background: theme.palette.background.paper, 
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
              variant="outlined" 
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
              sx={{ mt: 3, mb: 2, py: 1.2, fontSize: '1.1rem' }} 
              disabled={status === 'loading'} 
            >
              {status === 'loading' ? 'Iniciando sesión...' : 'Login'}
            </Button>
            <Button
              fullWidth
              variant="text"
              onClick={() => navigate('/register')}
              sx={{ color: theme.palette.text.secondary }} 
            >
              ¿No tienes cuenta? Regístrate
            </Button>
          </Box>
        </Paper>
      </motion.div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000} 
        onClose={handleSnackbarClose}
        TransitionComponent={TransitionLeft} 
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} 
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login;