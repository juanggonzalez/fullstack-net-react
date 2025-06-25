import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'; 
import { fetchProductById } from '../features/products/productsSlice'; 

import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Box, Rating, CircularProgress, Paper,
  List, ListItem, ListItemText, Divider, Grid 
} from '@mui/material';
import { styled } from '@mui/system';

const ImgStyled = styled('img')({
  maxWidth: '100%',
  maxHeight: '400px', 
  objectFit: 'contain',
  borderRadius: '8px',
});

function ProductDetail({ productId, open, onClose }) {
  const dispatch = useDispatch();
  const product = useSelector((state) => state.products.currentProduct);
  const loading = useSelector((state) => state.products.currentProductStatus === 'loading');
  const error = useSelector((state) => state.products.currentProductError);

  useEffect(() => {
    if (open && productId) {
      dispatch(fetchProductById(productId));
    }
  }, [open, productId, dispatch]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{product ? product.name : 'Cargando producto...'}</DialogTitle>
      <DialogContent dividers>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        )}
        {error && (
          <Box sx={{ p: 4, color: 'error.main', textAlign: 'center' }}>
            <Typography variant="h6" color="error">
              Error al cargar los detalles del producto.
            </Typography>
            <Typography variant="body2">
              {error}
            </Typography>
          </Box>
        )}
        {!loading && !error && product && (
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <ImgStyled src={product.imageUrl || '/images/default-product.png'} alt={product.name} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" component="h2" gutterBottom>
                {product.name}
              </Typography>
              <Typography variant="h6" color="primary" gutterBottom>
                ${product.price ? product.price.toFixed(2) : 'N/A'}
              </Typography>
              <Typography variant="body1" paragraph>
                {product.description}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                SKU: {product.sku}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Categoría: {product.categoryName}
              </Typography>
              {product.brandName && (
                <Typography variant="body2" color="text.secondary">
                  Marca: {product.brandName}
                </Typography>
              )}
              <Typography variant="body2" color="text.secondary">
                Stock disponible: {product.stock}
              </Typography>

              {product.averageRating > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                  <Rating value={product.averageRating} precision={0.5} readOnly />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    ({product.totalReviews} reseñas)
                  </Typography>
                </Box>
              )}

              {product.features && product.features.length > 0 && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Características
                  </Typography>
                  <List dense>
                    {product.features.map((feature, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={`• ${feature}`} />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}

              {product.sellerName && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Información del Vendedor
                  </Typography>
                  <Typography variant="body2">
                    Vendedor: {product.sellerName}
                  </Typography>
                  <Typography variant="body2">
                    Contacto: {product.sellerContact}
                  </Typography>
                </>
              )}
            </Grid>

            {/* Sección de Reseñas */}
            {product.reviews && product.reviews.length > 0 && (
              <Grid item xs={12}>
                <Divider sx={{ my: 4 }} />
                <Typography variant="h6" gutterBottom>
                  Reseñas de Clientes
                </Typography>
                {product.reviews.map((review) => (
                  <Paper key={review.id} elevation={1} sx={{ p: 2, mb: 2, borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle1" component="span" fontWeight="bold">{review.userName}</Typography>
                      <Rating value={review.rating} readOnly size="small" />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {new Date(review.reviewDate).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body1">{review.comment}</Typography>
                  </Paper>
                ))}
              </Grid>
            )}
            {product.reviews && product.reviews.length === 0 && (
                <Grid item xs={12}>
                    <Divider sx={{ my: 4 }} />
                    <Typography variant="h6" gutterBottom>Reseñas de Clientes</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Aún no hay reseñas para este producto. ¡Sé el primero en dejar una!
                    </Typography>
                </Grid>
            )}

          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ProductDetail;