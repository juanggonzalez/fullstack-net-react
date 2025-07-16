import { useState } from 'react';
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Menu,
  MenuItem,
  IconButton,
  Divider
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearAuth } from '../features/auth/authSlice';
import { syncCart } from '../features/cart/cartSlice';

const UserMenu = ({ isMobile, onCloseDrawer }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openCollapse, setOpenCollapse] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCollapseClick = () => {
    setOpenCollapse(!openCollapse);
  };

  const handleProfileSettings = () => {
    console.log("Navegar a Ajustes de Perfil");
    if (isMobile && onCloseDrawer) onCloseDrawer();
    handleClose();
    // navigate('/profile');
  };

  const handleMyOrders = () => {
    console.log("Navegar a Mis Órdenes");
    if (isMobile && onCloseDrawer) onCloseDrawer();
    handleClose();
    // navigate('/my-orders');
  };

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user')); 
    const userId = user?.id;

    try {
      await dispatch(syncCart({ token, userId })).unwrap();
    } finally {
      dispatch(clearAuth()); 
      localStorage.removeItem('token'); 
      localStorage.removeItem('user'); 
      if (isMobile && onCloseDrawer) onCloseDrawer();
      handleClose();
      navigate('/login');
    }
  };

  if (isMobile) {
    return (
      <>
        <ListItemButton onClick={handleCollapseClick}>
          <ListItemIcon>
            <AccountCircle />
          </ListItemIcon>
          <ListItemText primary="Usuario"  />
          {openCollapse ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openCollapse} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <MenuItem onClick={handleProfileSettings} sx={{ pl: 4 }}>
              Ajustes de Perfil
            </MenuItem>
            <MenuItem onClick={handleMyOrders} sx={{ pl: 4 }}>
              Mis Órdenes
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ pl: 4 }}>
              Cerrar Sesión
            </MenuItem>
          </List>
        </Collapse>
      </>
    );
  } else {
    return (
      <div>
        <IconButton
          size="medium"
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
};

export default UserMenu;
