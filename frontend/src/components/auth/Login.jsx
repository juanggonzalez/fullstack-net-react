import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';

import useAuthRedirect from '../../hooks/useAuthRedirect';
import useLoginForm from '../../hooks/useLoginHook';
import { useNavigate } from 'react-router-dom'; 

const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate(); 

  useAuthRedirect('/'); 

  const {
    register,
    handleSubmit,
    errors,
    isSubmitting, 
  } = useLoginForm();

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
              variant="outlined"
              {...register('username')}
              error={!!errors.username}
              helperText={errors.username?.message}
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
              variant="outlined"
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.2, fontSize: '1.1rem' }}
              disabled={isSubmitting} 
            >
              {isSubmitting ? 'Iniciando sesión...' : 'Login'}
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
    </Box>
  );
};

export default Login;
