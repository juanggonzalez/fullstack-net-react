import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../features/products/productsSlice';
import ProductDetail from './ProductDetail'; 
import ProductFilters from './ProductFilters';

import {
  Container, Grid, Card, CardContent, CardMedia, Typography,
  Button, CircularProgress, Box, Pagination, FormControl, Select, MenuItem, Drawer,
  IconButton
} from '@mui/material';

import FilterListIcon from '@mui/icons-material/FilterList'
import CloseIcon from '@mui/icons-material/Close'; 

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
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

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
    if (mobileFiltersOpen) {
      setMobileFiltersOpen(false);
    }
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

  const handleOpenDetailModal = (productId) => {
    setSelectedProductId(productId);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setSelectedProductId(null);
    setIsDetailModalOpen(false);
  };

  const toggleMobileFilters = () => {
    setMobileFiltersOpen(!mobileFiltersOpen);
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
        <Grid container spacing={3} flex justifyContent="center">
          {products.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4} lg={3} >
              <Card sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: 3,
                transition: 'transform 0.2s ease-in-out',
                cursor: 'pointer', 
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6, 
                },

              }}
                onClick={() => handleOpenDetailModal(product.id)}>
                <Box sx={{
                  width: '100%',
                  height: 180,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  p: 0.5
                }}>
                  <CardMedia
                    component="img"
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      borderRadius: 2
                    }}
                    image={product.imageUrl}
                    alt={product.name}
                  />
                </Box>
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 1.5 }}>
                  <Typography gutterBottom variant="h6" component="div" sx={{ fontSize: '1rem', mb: 0.5, lineHeight: '1.2' }}>
                    {product.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      minHeight: 30,
                      maxHeight: 45,
                      maxWidth: 200,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      mb: 0.5
                    }}
                  >
                    {product.description || 'No description available.'}
                  </Typography>
                  <Box sx={{ mt: 'auto' }}>
                    <Typography variant="h6" color="primary.main" sx={{ mt: 0.5, fontSize: '1rem' }}>
                      ${product.price ? product.price.toFixed(2) : 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                      Stock: {product.stock}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                      Categoría: {product.categoryName}
                    </Typography>
                    {product.brandName && (
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                        Marca: {product.brandName}
                      </Typography>
                    )}
                  </Box>
                </CardContent>
                <Box sx={{ p: 1.5 }}>
                  <Button variant="contained" color="primary" fullWidth size="small">
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

      <Box sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}> 
        <ProductFilters
          categoryId={categoryId} setCategoryId={handleCategoryChange}
          brandId={brandId} setBrandId={handleBrandChange}
          priceRange={priceRange} setPriceRange={handlePriceRangeChange}
          sortBy={sortBy} setSortBy={handleSortByChange}
          onClearFilters={handleClearAllFilters}
          categories={categories}
          brands={brands}
        />
      </Box>
      <Box sx={{ display: { xs: 'block', sm: 'block', md: 'none' } }}> 
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<FilterListIcon />}
            onClick={toggleMobileFilters}
            sx={{ width: '100%', py: 1.5 }} 
          >
            Filtros
          </Button>
        </Box>
      </Box>
      <Drawer
        anchor="right" 
        open={mobileFiltersOpen}
        onClose={toggleMobileFilters}
        sx={{
          '& .MuiDrawer-paper': { width: '80%', maxWidth: 350, boxSizing: 'border-box', p: 2 }, 
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Filtros de Productos</Typography>
          <IconButton onClick={toggleMobileFilters}>
            <CloseIcon />
          </IconButton>
        </Box>
        <ProductFilters
          categoryId={categoryId} setCategoryId={handleCategoryChange}
          brandId={brandId} setBrandId={handleBrandChange}
          priceRange={priceRange} setPriceRange={handlePriceRangeChange}
          sortBy={sortBy} setSortBy={handleSortByChange}
          onClearFilters={() => { handleClearAllFilters(); toggleMobileFilters(); }} 
          categories={categories}
          brands={brands}
          isMobileView={true}
        />
        <Box sx={{ mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={toggleMobileFilters} 
          >
            Aplicar Filtros
          </Button>
        </Box>
      </Drawer>
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
      <ProductDetail
        productId={selectedProductId}
        open={isDetailModalOpen}
        onClose={handleCloseDetailModal}
      />
    </Container>
  );
}

export default ProductList;