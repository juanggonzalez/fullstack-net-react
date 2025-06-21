// frontend/src/components/GlobalSearchBar.jsx

import React from 'react';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

// El componente ahora acepta props para el color del label y el texto
function GlobalSearchBar({ searchQuery, onSearchChange, inputLabelColor, inputTextColor }) {
  return (
    <TextField
      label="Buscar producto"
      variant="outlined"
      size="small"
      value={searchQuery}
      onChange={onSearchChange}
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.15)', // Fondo blanco translúcido
        borderRadius: 1,
        width: { xs: '100%', sm: 'auto' }, // Ocupa todo el ancho en móvil, auto en otros
        minWidth: 200, // Ancho mínimo para desktop
        maxWidth: 400, // Ancho máximo
        '.MuiOutlinedInput-root': {
          borderRadius: 1,
          '& fieldset': { // Oculta el borde por defecto (fieldset es el borde del outlined input)
            borderColor: 'transparent !important',
          },
          '&:hover fieldset': {
            borderColor: 'transparent !important',
          },
          '&.Mui-focused fieldset': {
            borderColor: 'transparent !important',
          },
        },
        input: {
          color: inputTextColor || 'white', // Usa la prop o blanco por defecto
        },
        label: {
          color: inputLabelColor || 'rgba(255, 255, 255, 0.7)', // Usa la prop o un blanco translúcido
          '&.Mui-focused': { // Color del label cuando está enfocado
            color: inputLabelColor || 'rgba(255, 255, 255, 0.9)',
          },
        }
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon sx={{ color: inputLabelColor || 'rgba(255, 255, 255, 0.7)' }} /> {/* Color del icono */}
          </InputAdornment>
        ),
      }}
    />
  );
}

export default GlobalSearchBar;