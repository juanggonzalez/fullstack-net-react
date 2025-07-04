import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductList from './components/ProductList';
import GlobalSearchBar from './components/GlobalSearchBar';
import UserMenu from './components/UserMenu';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProtectedRoute from './components/auth/ProtectedRoute';
import NotFound from './components/error/NotFound'; 
import {
  AppBar, Toolbar, Typography, Box
} from '@mui/material';

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const MainLayout = ({ children }) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'background.default' }}>
      <AppBar position="static" sx={{ mb: 2, backgroundColor: 'primary.dark' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography
            variant="h6"
            component="div"
            sx={{ color: 'white' }}
          >
            Zenith Mart
          </Typography>

          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            <GlobalSearchBar
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              inputLabelColor="rgba(255, 255, 255, 0.7)"
              inputTextColor="white"
            />
          </Box>

          <UserMenu />
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {children}
      </Box>
    </Box>
  );

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route
            path="/"
            element={
              <MainLayout>
                <ProductList globalSearchQuery={searchQuery} />
              </MainLayout>
            }
          />
        </Route>

        <Route path="*" element={<NotFound />} /> 
      </Routes>
    </Router>
  );
}

export default App;