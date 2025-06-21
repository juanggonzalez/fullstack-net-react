// src/components/auth/Register.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../features/auth/authSlice';
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

function TransitionRight(props) {
  return <Slide {...props} direction="right" />;
}

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Nuevo estado para ConfirmPassword
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  const { status, error } = useSelector((state) => state.auth);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');

  // Efecto para mostrar mensajes de registro y redirigir
  useEffect(() => {
    if (status === 'succeeded' && !error) {
      setSnackbarMessage('¡Registro exitoso! Ahora puedes iniciar sesión.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else if (status === 'failed' && error) {
      // El mensaje de error ya viene procesado por el interceptor de Axios
      setSnackbarMessage(error); // error ahora es el string del mensaje amigable
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  }, [status, error, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación básica de todos los campos
    if (
      username.trim() === '' ||
      password.trim() === '' ||
      confirmPassword.trim() === '' || // Validar confirmPassword también
      email.trim() === ''
      // firstName.trim() === '' || // firstName y lastName pueden ser opcionales en el backend
      // lastName.trim() === ''
    ) {
      setSnackbarMessage('Por favor, completa todos los campos requeridos (usuario, contraseña, email).');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return;
    }

    // Validación de coincidencia de contraseñas ANTES de enviar al backend
    if (password !== confirmPassword) {
      setSnackbarMessage('La contraseña y la confirmación de contraseña no coinciden.');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return;
    }

    // Dispara la acción asíncrona de registro, incluyendo confirmPassword
    dispatch(register({ username, password, confirmPassword, email, firstName, lastName }));
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const gradientBackground = `linear-gradient(135deg, ${theme.palette.secondary.light} 0%, ${theme.palette.primary.light} 100%)`;

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
            Registrarse
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
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword" // Nuevo campo
              label="Confirmar Contraseña" // Nuevo label
              type="password"
              id="confirmPassword" // Nuevo ID
              autoComplete="new-password" // Nuevo autocomplete
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              variant="outlined"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
            />
            <TextField
              margin="normal"
              fullWidth
              id="firstName"
              label="Nombre"
              name="firstName"
              autoComplete="given-name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              variant="outlined"
            />
            <TextField
              margin="normal"
              fullWidth
              id="lastName"
              label="Apellido"
              name="lastName"
              autoComplete="family-name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              variant="outlined"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.2, fontSize: '1.1rem' }}
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Registrando...' : 'Registrarse'}
            </Button>
            <Button
              fullWidth
              variant="text"
              onClick={() => navigate('/login')}
              sx={{ color: theme.palette.text.secondary }}
            >
              ¿Ya tienes cuenta? Inicia sesión
            </Button>
          </Box>
        </Paper>
      </motion.div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        TransitionComponent={TransitionRight}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Register;