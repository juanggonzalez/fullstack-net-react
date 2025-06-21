import React, { useState } from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useDispatch } from 'react-redux'; 
import { clearAuth } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom'; 

function UserMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch(); 
  const navigate = useNavigate(); 

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
    dispatch(clearAuth()); 
    localStorage.removeItem('token'); 
    localStorage.removeItem('user'); 
    handleClose(); 
    navigate('/login'); 
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
        <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem> 
      </Menu>
    </div>
  );
}

export default UserMenu;