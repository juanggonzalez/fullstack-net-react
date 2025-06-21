import React, { useState } from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useDispatch } from 'react-redux'; // Importa useDispatch
import { clearAuth } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate

function UserMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch(); // Inicializa useDispatch
  const navigate = useNavigate(); // Inicializa useNavigate

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfileSettings = () => {
    console.log("Navegar a Ajustes de Perfil");
    handleClose();
    // Aquí puedes añadir la lógica para navegar, por ejemplo:
    // navigate('/profile-settings');
  };

  const handleMyOrders = () => {
    console.log("Navegar a Mis Órdenes");
    handleClose();
    // Aquí puedes añadir la lógica para navegar, por ejemplo:
    // navigate('/my-orders');
  };

  const handleLogout = () => {
    dispatch(clearAuth()); // Despacha la acción para limpiar la autenticación
    localStorage.removeItem('token'); // Borra el token del localStorage
    localStorage.removeItem('user'); // Borra la información del usuario del localStorage
    handleClose(); // Cierra el menú
    navigate('/login'); // Redirige al usuario a la página de login
  };

  return (
    <div>
      <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
        sx={{ color: 'white' }}
      >
        <AccountCircle />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleProfileSettings}>Ajustes de Perfil</MenuItem>
        <MenuItem onClick={handleMyOrders}>Mis Órdenes</MenuItem>
        <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem> {/* Asigna la función handleLogout */}
      </Menu>
    </div>
  );
}

export default UserMenu;