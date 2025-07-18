import { useSelector, useDispatch } from 'react-redux';
import { removeItem, updateItemQuantity, clearLocalCart, syncCart, fetchCart } from '../features/cart/cartSlice';
import { createOrderFromCart } from '../features/order/orderSlice'; 
import { showNotification } from '../features/notifications/notificationsSlice'; 
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Box, IconButton, Divider, List, ListItem, ListItemText,
  CardMedia, TextField, Grid, Paper, Snackbar, Alert, CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { selectUser } from '../features/auth/authSlice';

const ShoppingCart = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);
  const cartStatus = useSelector((state) => state.cart.status); 
  const orderStatus = useSelector((state) => state.order.status); 
  const cartError = useSelector((state) => state.cart.error);
  const user = useSelector(selectUser);
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleRemoveFromCart = (cartItemId) => {
    dispatch(removeItem(cartItemId));
  };

  const handleUpdateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      dispatch(removeItem(cartItemId));
      return;
    }
    dispatch(updateItemQuantity({ id: cartItemId, quantity: newQuantity }));
  };

  const handleClearCart = () => {
    dispatch(clearLocalCart());
  };

  const handleProceedToCheckout = async () => {
    if (cartItems.length === 0) {
      dispatch(showNotification({
        message: 'Tu carrito está vacío. Añade productos antes de finalizar la compra.',
        severity: 'warning',
        duration: 3000,
      }));
      return;
    }

    const userAddresses = user?.addresses;
    if (!userAddresses || userAddresses.length === 0) {
      dispatch(showNotification({
        message: 'No tienes direcciones registradas. Por favor, añade una dirección en tu perfil.',
        severity: 'error',
        duration: 5000,
      }));
      return;
    }

    const shippingAddress = userAddresses.find(addr => addr.isDefaultShipping);
    const billingAddress = userAddresses.find(addr => addr.isDefaultBilling);

    if (!shippingAddress) {
      dispatch(showNotification({
        message: 'No se encontró una dirección de envío por defecto. Por favor, configura una en tu perfil.',
        severity: 'error',
        duration: 5000,
      }));
      return;
    }

    if (!billingAddress) {
      dispatch(showNotification({
        message: 'No se encontró una dirección de facturación por defecto. Por favor, configura una en tu perfil.',
        severity: 'error',
        duration: 5000,
      }));
      return;
    }

    dispatch(showNotification({
      message: 'Sincronizando carrito...',
      severity: 'info',
      duration: 2000, 
    }));

    const syncResultAction = await dispatch(syncCart());

    if (syncCart.fulfilled.match(syncResultAction)) {
      dispatch(showNotification({
        message: 'Carrito sincronizado. Procesando tu compra...',
        severity: 'success',
        duration: 2000,
      }));

      const shippingAddressId = shippingAddress.id;
      const billingAddressId = billingAddress.id;
      const paymentMethod = "Tarjeta de Crédito"; 

      const orderResultAction = await dispatch(createOrderFromCart({
        shippingAddressId: shippingAddressId,
        billingAddressId: billingAddressId,
        paymentMethod: paymentMethod
      }));


      if (createOrderFromCart.fulfilled.match(orderResultAction)) {
        dispatch(showNotification({
          message: '¡Tu compra ha sido realizada con éxito!',
          severity: 'success',
          duration: 3000,
        }));
        onClose();
        navigate('/my-orders'); 
      } else {
        const errorMessage = orderResultAction.payload || 'Hubo un error al finalizar la compra.';
        dispatch(showNotification({
          message: errorMessage,
          severity: 'error',
          duration: 5000,
        }));
      }
    } else {
      const syncErrorMessage = syncResultAction.payload || 'No se pudo sincronizar el carrito. Intenta de nuevo.';
      dispatch(showNotification({
        message: syncErrorMessage,
        severity: 'error',
        duration: 5000,
      }));
    }
  };


  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.productPrice * item.quantity), 0).toFixed(2);
  };

  const isCheckoutLoading = orderStatus === 'loading';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Tu Carrito de Compras</DialogTitle>
      <DialogContent dividers>
        {(cartStatus === 'loading' || isCheckoutLoading) && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>{isCheckoutLoading ? 'Procesando Compra...' : 'Cargando carrito...'}</Typography>
          </Box>
        )}
        {cartStatus === 'failed' && cartError && (
          <Typography variant="body1" color="error" sx={{ p: 2, textAlign: 'center' }}>
            Error al cargar el carrito: {cartError}
          </Typography>
        )}
        {cartStatus !== 'loading' && cartItems.length === 0 && !isCheckoutLoading ? (
          <Typography variant="body1" sx={{ p: 2, textAlign: 'center' }}>
            Tu carrito está vacío. ¡Añade algunos productos!
          </Typography>
        ) : (
          <List>
            {cartItems.map((item) => (
              <Paper key={item.id || item.productId} elevation={1} sx={{ mb: 2, borderRadius: 2 }}>
                <ListItem sx={{ py: 1.5, px: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={2}>
                      <CardMedia
                        component="img"
                        sx={{ width: '100%', height: 60, objectFit: 'contain', borderRadius: 1 }}
                        image={item.productImageUrl || '/images/default-product.png'}
                        alt={item.productName}
                      />
                    </Grid>
                    <Grid item xs={5}>
                      <ListItemText
                        primary={<Typography variant="subtitle1" fontWeight="bold">{item.productName}</Typography>}
                        secondary={`$${item.productPrice?.toFixed(2) || '0.00'}`}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton
                          size="small"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <TextField
                          value={item.quantity}
                          onChange={(e) => handleUpdateQuantity(item.id, Number(e.target.value))}
                          type="number"
                          size="small"
                          sx={{ width: 50, mx: 0.5, '& input': { textAlign: 'center' } }}
                          inputProps={{ min: 1 }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Grid>
                    <Grid item xs={2} sx={{ textAlign: 'right' }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        ${((item.productPrice || 0) * item.quantity).toFixed(2)}
                      </Typography>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleRemoveFromCart(item.id)}
                        size="small"
                        sx={{ mt: 0.5 }}
                      >
                        <DeleteIcon fontSize="small" color="error" />
                      </IconButton>
                    </Grid>
                  </Grid>
                </ListItem>
              </Paper>
            ))}
          </List>
        )}
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, py: 1 }}>
          <Typography variant="h6">Total:</Typography>
          <Typography variant="h6">${calculateTotal()}</Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="secondary" variant="outlined">
          Seguir Comprando
        </Button>
        <Button
          onClick={handleClearCart}
          color="error"
          variant="outlined"
          disabled={cartItems.length === 0 || isCheckoutLoading}
        >
          Vaciar Carrito
        </Button>
        <Button
          color="primary"
          variant="contained"
          onClick={handleProceedToCheckout}
          disabled={cartItems.length === 0 || isCheckoutLoading}
        >
          {isCheckoutLoading ? 'Procesando Compra...' : 'Proceder al Pago'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ShoppingCart;