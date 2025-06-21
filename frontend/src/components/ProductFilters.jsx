import React from 'react';
import {
  Grid, Button, Select, MenuItem, InputLabel, FormControl,
  Typography, Slider, Box, Paper
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

function ProductFilters({
  categoryId, setCategoryId,
  brandId, setBrandId,
  priceRange, setPriceRange,
  sortBy, setSortBy,
  onClearFilters,
  categories,
  brands
}) {

  const handlePriceRangeChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
      <Grid container spacing={2} alignItems="flex-end"> 

        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth variant="outlined"> 
            <InputLabel>Categoría</InputLabel>
            <Select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              label="Categoría"
            >
              <MenuItem value="">
                <em>Todas</em>
              </MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth variant="outlined"> 
            <InputLabel>Marca</InputLabel>
            <Select
              value={brandId}
              onChange={(e) => setBrandId(e.target.value)}
              label="Marca"
            >
              <MenuItem value="">
                <em>Todas</em>
              </MenuItem>
              {brands.map((brand) => (
                <MenuItem key={brand.id} value={brand.id}>
                  {brand.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={12} md={4}>
          <Box sx={{ px: 1 }}>
            <Typography gutterBottom variant="subtitle2" color="text.secondary">Rango de Precio: ${priceRange[0]} - ${priceRange[1]}{priceRange[1] === 1000 ? '+' : ''}</Typography>
            <Slider
              value={priceRange}
              onChangeCommitted={handlePriceRangeChange}
              valueLabelDisplay="auto"
              min={0}
              max={1000}
              step={10}
              marks={[
                { value: 0, label: '$0' },
                { value: 1000, label: '$1000+' }
              ]}
              sx={{ width: '95%', ml: '2.5%' }}
            />
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth variant="outlined"> 
            <InputLabel>Ordenar por</InputLabel>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              label="Ordenar por"
            >
              <MenuItem value="">
                <em>Relevancia</em>
              </MenuItem>
              <MenuItem value="priceAsc">Precio: Más bajo primero</MenuItem>
              <MenuItem value="priceDesc">Precio: Más alto primero</MenuItem>
              <MenuItem value="nameAsc">Nombre: A-Z</MenuItem>
              <MenuItem value="nameDesc">Nombre: Z-A</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={2} sx={{ display: 'flex', justifyContent: 'flex-end', pt: { xs: 2, md: 0 } }}>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<ClearIcon />}
            onClick={onClearFilters}
            sx={{ width: { xs: '100%', sm: 'auto' }, height: '56px' }} 
          >
            Limpiar Filtros
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default ProductFilters;