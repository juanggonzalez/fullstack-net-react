import React, { useState } from 'react';
import ProductList from './components/ProductList';
import GlobalSearchBar from './components/GlobalSearchBar'; // Importa el nuevo componente
import UserMenu from './components/UserMenu'; // Importa el nuevo componente
import {
  AppBar, Toolbar, Typography, Box
} from '@mui/material';

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'background.default' }}>
      <AppBar position="static" sx={{ mb: 2, backgroundColor: 'primary.dark' }}> {/* mb: 2 para acercar los filtros */}
        <Toolbar sx={{ justifyContent: 'space-between' }}> {/* Ajusta justificación para distribuir */}
          <Typography
            variant="h6"
            component="div"
            sx={{ color: 'white' }}
          >
            Zenith Mart {/* Nombre de fantasía para tu E-commerce */}
          </Typography>

          {/* Contenedor para centrar la barra de búsqueda */}
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            <GlobalSearchBar
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              inputLabelColor="rgba(255, 255, 255, 0.7)" // Texto del label más claro
              inputTextColor="white" // Texto del input blanco
            />
          </Box>

          {/* Menú de usuario */}
          <UserMenu />
        </Toolbar>
      </AppBar>
      <ProductList globalSearchQuery={searchQuery} />
    </Box>
  );
}

export default App;