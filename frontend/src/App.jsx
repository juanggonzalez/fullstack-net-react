import { useEffect } from 'react'; 
import { BrowserRouter as Router } from 'react-router-dom'; 
import { Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux'; 
import RoutesComponent from './components/routes/RoutesComponent';
import Notifications from './components/Notificactions';
import { syncCart } from './features/cart/cartSlice'; 
import { selectIsAuthenticated } from './features/auth/authSlice'; 

const App = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const cartItems = useSelector((state) => state.cart.items); 

  const totalCartItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isAuthenticated && totalCartItems > 0) {
        dispatch(syncCart());
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [dispatch, isAuthenticated, totalCartItems]); 

  return (
    <Router> 
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <RoutesComponent />
      </Box>
      <Notifications />
    </Router>
  );
}

export default App;