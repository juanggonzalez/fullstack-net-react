import { Routes, Route } from 'react-router-dom';
import ProductList from '../ProductList';
import Login from '../auth/Login';
import Register from '../auth/Register';
import AppHeader from '../AppHeader';
import NotFound from '../error/NotFound';
import ShoppingCart from '../ShoppingCart';
import { useDispatch, useSelector } from 'react-redux';
import { closeCart } from '../../features/cart/cartSlice'; 
import ProtectedRoute from './ProtectedRoute';
  
const RoutesComponent = ({ globalSearchQuery }) => {
  const dispatch = useDispatch();
  const isCartModalOpen = useSelector((state) => state.cart.isOpen);
  
  const handleCloseCartModal = () => {
    dispatch(closeCart());
  };

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<NotFound />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" 
          element={
            <>
              <AppHeader />
              <ProductList globalSearchQuery={globalSearchQuery} />
              <ShoppingCart open={isCartModalOpen} onClose={handleCloseCartModal} />
            </>
          } 
        />
      </Route>
    </Routes>
  );
};

export default RoutesComponent;