import React, { useEffect } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import useAuthRedirect from '../../hooks/useAuthRedirect';
import useRegisterHook from '../../hooks/forms/useRegisterHook';
import { showNotification } from '../../features/notifications/notificationsSlice'; 

const Register = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch(); 

  useAuthRedirect('/'); 

  const {
    registerForm, 
    handleSubmit,
    errors,
    isSubmitting,
    reset,
  } = useRegisterHook();

  const { status, error } = useSelector((state) => state.auth); 

  useEffect(() => {
    if (status === 'succeeded' && !error) {
      dispatch(showNotification({
        message: '¡Registro exitoso! Ahora puedes iniciar sesión. 🎉',
        severity: 'success',
        duration: 3000,
      }));
      reset();
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else if (status === 'failed' && error) {
      dispatch(showNotification({
        message: error || 'Error en el registro. Inténtalo de nuevo. 😥',
        severity: 'error',
        duration: 5000,
      }));
    }
  }, [status, error, navigate, dispatch, reset]); 

  const gradientBackground = theme.palette.gradients.primaryToSecondary; 

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
              variant="outlined"
              {...registerForm('username')} 
              error={!!errors.username}
              helperText={errors.username?.message}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="email"
              label="Email"
              type="email"
              id="email"
              autoComplete="email"
              variant="outlined"
              {...registerForm('email')} 
              error={!!errors.email}
              helperText={errors.email?.message}
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
              variant="outlined"
              {...registerForm('password')} 
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirmar Contraseña"
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              variant="outlined"
              {...registerForm('confirmPassword')} 
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
            />
            <TextField
              margin="normal"
              fullWidth
              id="firstName"
              label="Nombre (Opcional)"
              name="firstName"
              autoComplete="given-name"
              variant="outlined"
              {...registerForm('firstName')} 
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
            />
            <TextField
              margin="normal"
              fullWidth
              id="lastName"
              label="Apellido (Opcional)"
              name="lastName"
              autoComplete="family-name"
              variant="outlined"
              {...registerForm('lastName')} 
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.2, fontSize: '1.1rem' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registrando...' : 'Registrarse'}
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
    </Box>
  );
};

export default Register;
