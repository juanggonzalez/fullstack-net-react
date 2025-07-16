
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const GlobalSearchBar = ({ searchQuery, onSearchChange, inputLabelColor, inputTextColor }) => {
  return (
    <TextField
      label="Buscar producto"
      variant="outlined"
      size="small"
      value={searchQuery}
      onChange={onSearchChange}
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.15)', 
        borderRadius: 1,
        width: { xs: '100%', sm: 'auto' },
        minWidth: 200,
        maxWidth: 500, 
        '.MuiOutlinedInput-root': {
          borderRadius: 1,
          '& fieldset': { 
            borderColor: 'transparent !important',
          },
          '&:hover fieldset': {
            borderColor: 'transparent !important',
          },
          '&.Mui-focused fieldset': {
            borderColor: 'transparent !important',
          },
        },
        input: {
          color: inputTextColor || 'white', 
        },
        label: {
          color: inputLabelColor || 'rgba(255, 255, 255, 0.7)', 
          '&.Mui-focused': { 
            color: inputLabelColor || 'rgba(255, 255, 255, 0.9)',
          },
        }
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon sx={{ color: inputLabelColor || 'rgba(255, 255, 255, 0.7)' }} /> 
          </InputAdornment>
        ),
      }}
    />
  );
}

export default GlobalSearchBar;