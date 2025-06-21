import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../features/products/productsSlice';

import ProductFilters from './ProductFilters';

import {
  Container, Grid, Card, CardContent, CardMedia, Typography,
  Button, CircularProgress, Box, Pagination, FormControl, Select, MenuItem
} from '@mui/material';

function ProductList({ globalSearchQuery }) {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.items);
  const productStatus = useSelector((state) => state.products.status);
  const error = useSelector((state) => state.products.error);
  const totalProducts = useSelector((state) => state.products.totalCount);

  const [categoryId, setCategoryId] = useState('');
  const [brandId, setBrandId] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  const categories = [
    { id: 1, name: 'Electronics' },
    { id: 2, name: 'Books' },
    { id: 3, name: 'Clothing' },
    { id: 4, name: 'Home & Kitchen' },
  ];
  const brands = [
    { id: 1, name: 'TechPro' },
    { id: 2, name: 'Bookworm Inc.' },
    { id: 3, name: 'FashionWear' },
  ];

  useEffect(() => {
    dispatch(fetchProducts({
      search: globalSearchQuery,
      categoryId: categoryId || null,
      brandId: brandId || null,
      minPrice: priceRange[0],
      maxPrice: priceRange[1] === 1000 ? null : priceRange[1],
      pageNumber: currentPage,
      pageSize,
      sortBy
    }));

  }, [dispatch, globalSearchQuery, categoryId, brandId, priceRange, currentPage, pageSize, sortBy]);


  const handleCategoryChange = (value) => { setCategoryId(value); setCurrentPage(1); };
  const handleBrandChange = (value) => { setBrandId(value); setCurrentPage(1); };
  const handlePriceRangeChange = (value) => { setPriceRange(value); setCurrentPage(1); };
  const handleSortByChange = (value) => { setSortBy(value); setCurrentPage(1); };

  const handleClearAllFilters = () => {
    setCategoryId('');
    setBrandId('');
    setPriceRange([0, 1000]);
    setSortBy('');
    setCurrentPage(1);
  };

  let content;

  if (productStatus === 'loading') {
    content = (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, py: 8 }}>
        <CircularProgress />
      </Box>
    );
  } else if (productStatus === 'succeeded') {
    if (products.length === 0) {
      content = (
        <Typography variant="h6" align="center" sx={{ mt: 4, py: 8, color: 'text.secondary' }}>
          No se encontraron productos con los filtros seleccionados.
        </Typography>
      );
    } else {
      content = (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  sx={{ aspectRatio: '1/1', objectFit: 'contain', maxHeight: 200, padding: 2 }}
                  image={product.imageUrl || 'https://via.placeholder.com/150?text=No+Image'}
                  alt={product.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="div">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ minHeight: 40, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {product.description?.substring(0, 70) + (product.description && product.description.length > 70 ? '...' : '') || 'No description available.'}
                  </Typography>
                  <Typography variant="h6" color="primary.main" sx={{ mt: 1 }}>
                    ${product.price.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Stock: {product.stock}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Categoría: {product.categoryName}
                  </Typography>
                  {product.brandName && (
                    <Typography variant="body2" color="text.secondary">
                      Marca: {product.brandName}
                    </Typography>
                  )}
                </CardContent>
                <Box sx={{ p: 2 }}>
                  <Button variant="contained" color="primary" fullWidth>
                    Añadir al Carrito
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      );
    }
  } else if (productStatus === 'failed') {
    content = (
      <Typography variant="h6" color="error" align="center" sx={{ mt: 4, py: 8 }}>
        Error al cargar productos: {error}
      </Typography>
    );
  }

  const totalPages = Math.ceil(totalProducts / pageSize);

  return (
    <Container maxWidth="lg" sx={{ flexGrow: 1, mb: 4, mt: 0 }}> 
      <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 3, color: 'text.primary' }}>
        Explora Nuestros Productos
      </Typography>

      <ProductFilters
        categoryId={categoryId} setCategoryId={handleCategoryChange}
        brandId={brandId} setBrandId={handleBrandChange}
        priceRange={priceRange} setPriceRange={handlePriceRangeChange}
        sortBy={sortBy} setSortBy={handleSortByChange}
        onClearFilters={handleClearAllFilters}
        categories={categories}
        brands={brands}
      />

      {content}

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 4, mb: 4, gap: 2 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(event, value) => setCurrentPage(value)}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
          />
          <FormControl variant="outlined" size="small">
            <Select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
            >
              <MenuItem value={6}>6 por página</MenuItem>
              <MenuItem value={12}>12 por página</MenuItem>
              <MenuItem value={24}>24 por página</MenuItem>
            </Select>
          </FormControl>
        </Box>
      )}
    </Container>
  );
}

export default ProductList;