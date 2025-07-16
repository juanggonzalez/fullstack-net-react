import { useSelector, useDispatch } from 'react-redux';
import { removeItem, updateItemQuantity, clearLocalCart, syncCart, fetchCart } from '../features/cart/cartSlice'; 
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Box, IconButton, Divider, List, ListItem, ListItemText,
  CardMedia, TextField, Grid, Paper, Snackbar, Alert, CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { useEffect } from 'react';

const ShoppingCart = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const cartStatus = useSelector((state) => state.cart.status); 

  useEffect(() => {
    dispatch(fetchCart())
  }, [])
  


  const handleRemoveFromCart = (cartItemId, productName) => {
    dispatch(removeItem(cartItemId)); 
  };

  const handleUpdateQuantity = (cartItemId, newQuantity, productName) => {
    if (newQuantity < 0) return;
    dispatch(updateItemQuantity({ cartItemId, quantity: newQuantity })); 
  };

  const handleClearCart = () => {
    dispatch(clearLocalCart()); 
  };

  const handleProceedToCheckout = () => {
    dispatch(syncCart())
      .unwrap()
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.productPrice * item.quantity), 0).toFixed(2);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Tu Carrito de Compras</DialogTitle>
      <DialogContent dividers>
        {cartStatus === 'loading' && ( 
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Cargando carrito...</Typography>
          </Box>
        )}
        {cartStatus === 'failed' && ( 
          <Typography variant="body1" color="error" sx={{ p: 2, textAlign: 'center' }}>
            Error al cargar el carrito: {cartStatus.error}
          </Typography>
        )}
        {cartStatus !== 'loading' && cartItems.length === 0 ? (
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
                        secondary={`$${item.productPrice.toFixed(2)}`}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton
                          size="small"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1, item.productName)}
                          disabled={item.quantity <= 1}
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <TextField
                          value={item.quantity}
                          onChange={(e) => handleUpdateQuantity(item.id, Number(e.target.value), item.productName)}
                          type="number"
                          size="small"
                          sx={{ width: 50, mx: 0.5, '& input': { textAlign: 'center' } }}
                          inputProps={{ min: 1 }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1, item.productName)}
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Grid>
                    <Grid item xs={2} sx={{ textAlign: 'right' }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        ${(item.productPrice * item.quantity).toFixed(2)}
                      </Typography>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleRemoveFromCart(item.id, item.productName)}
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
          disabled={cartItems.length === 0}
        >
          Vaciar Carrito
        </Button>
        <Button
          color="primary"
          variant="contained"
          onClick={handleProceedToCheckout} 
          disabled={cartItems.length === 0 || cartStatus === 'loading'}
        >
          Proceder al Pago
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ShoppingCart;
