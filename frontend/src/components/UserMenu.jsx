import React, { useState } from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';

function UserMenu() {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfileSettings = () => {
    console.log("Navegar a Ajustes de Perfil");
    handleClose();
  };

  const handleMyOrders = () => {
    console.log("Navegar a Mis Órdenes");
    handleClose();
  };

  const handleLogout = () => {
    console.log("Cerrar Sesión");
    handleClose();
  };

  return (
    <div>
      <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit" // Hereda el color del AppBar, si no, usa sx para especificar
        sx={{ color: 'white' }} // Asegura que el icono sea blanco
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
        <MenuItem onClick={handleProfileSettings}>Mi Perfil</MenuItem>
        <MenuItem onClick={handleMyOrders}>Mis Órdenes</MenuItem>
        <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
      </Menu>
    </div>
  );
}

export default UserMenu;