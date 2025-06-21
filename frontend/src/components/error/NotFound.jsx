import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/'); 
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh', 
          textAlign: 'center',
          p: 3,
        }}
      >
        <Typography variant="h1" component="h1" sx={{ fontSize: { xs: '3rem', sm: '4rem', md: '6rem' }, mb: 2, color: 'primary.main' }}>
          404
        </Typography>
        <Typography variant="h4" component="h2" sx={{ mb: 3, color: 'text.secondary' }}>
          ¡Página no encontrada!
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, maxWidth: '600px' }}>
          Lo sentimos, la página que estás buscando no existe o se ha movido. Por favor, verifica la URL o regresa al inicio.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleGoHome}
          sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
        >
          Ir a la página de inicio
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;