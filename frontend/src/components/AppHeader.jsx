import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    AppBar, Toolbar, Button, Box, Badge, IconButton,
    Drawer, List, ListItem, ListItemText, Divider,
    useTheme,
    useMediaQuery,
    ListItemButton, 
    ListItemIcon
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import GlobalSearchBar from './GlobalSearchBar';
import UserMenu from './UserMenu';
import { openCart } from '../features/cart/cartSlice';
import Title from './Title';
import { selectIsAuthenticated } from '../features/auth/authSlice';


const AppHeader = () => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const cartItems = useSelector((state) => state.cart.items);
    const isAuthenticated = useSelector(selectIsAuthenticated);

    const [globalSearchQuery, setGlobalSearchQuery] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleOpenCartModal = () => {
        dispatch(openCart());
        if (isMobile) {
            setMobileMenuOpen(false);
        }
    };

    const handleSearchChange = (event) => {
        setGlobalSearchQuery(event.target.value);
    };

    const totalCartItems = cartItems.reduce((total, item) => total + item.quantity, 0);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const closeDrawer = () => {
        setMobileMenuOpen(false); 
    };


    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
                <Toolbar>
                    <Title />
                    <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', mx: { xs: 1, md: 0 } }}>
                        <GlobalSearchBar
                            searchQuery={globalSearchQuery}
                            onSearchChange={handleSearchChange}
                            inputLabelColor="rgba(255, 255, 255, 0.7)"
                            inputTextColor="white"
                        />
                    </Box>


                    {!isMobile && (
                        <Box sx={{ display: 'flex', alignItems: 'center', ml: 2, flexShrink: 0 }}>
                            <IconButton
                                color="inherit"
                                aria-label="cart"
                                onClick={handleOpenCartModal}
                                sx={{ color: 'white' }}
                            >
                                <Badge badgeContent={totalCartItems} color="error">
                                    <ShoppingCartIcon sx={{ color: 'white' }} />
                                </Badge>
                            </IconButton>
                            {isAuthenticated ? <UserMenu isMobile={false} /> : <Button color="inherit">Login</Button>}
                        </Box>
                    )}


                    {isMobile && (
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="end"
                            onClick={toggleMobileMenu}
                            sx={{ ml: 2, flexShrink: 0 }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                </Toolbar>
            </AppBar>

            <Drawer
                anchor="right"
                open={mobileMenuOpen}
                onClose={toggleMobileMenu}
                sx={{
                    '& .MuiDrawer-paper': { width: '80%', maxWidth: 300, boxSizing: 'border-box' },
                }}
            >
                <Box
                    sx={{ width: 'auto' }}
                    role="presentation"
                    onKeyDown={toggleMobileMenu}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
                        <IconButton onClick={toggleMobileMenu}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <List>
                        <Divider />
                        <ListItemButton onClick={handleOpenCartModal}>
                            <ListItemIcon> 
                                <Badge badgeContent={totalCartItems} color="error">
                                    <ShoppingCartIcon />
                                </Badge>
                            </ListItemIcon>
                            <ListItemText primary="Carrito" />
                        </ListItemButton>
                        <Divider />
                        <UserMenu isMobile={isMobile} onCloseDrawer={closeDrawer} />
                    </List>
                </Box>
            </Drawer>

        </Box>
    );
}

export default AppHeader;