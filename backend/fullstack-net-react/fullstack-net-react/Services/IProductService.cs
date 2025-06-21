using EcommerceApi.Dtos;

namespace EcommerceApi.Services
{
    public interface IProductService
    {
        Task<IEnumerable<ProductDto>> GetAllProductsAsync();
        Task<ProductDto?> GetProductByIdAsync(int id);
        Task<ProductDto> CreateProductAsync(ProductCreateDto productDto);
        Task<bool> UpdateProductAsync(ProductUpdateDto productDto);
        Task<bool> DeleteProductAsync(int id);
        Task<bool> UpdateProductStockAsync(ProductStockUpdateDto stockDto);

        Task<IEnumerable<ProductDto>> GetFilteredProductsAsync(
            string? search = null,
            int? categoryId = null,
            int? brandId = null,
            decimal? minPrice = null,
            decimal? maxPrice = null,
            int pageNumber = 1,
            int pageSize = 10,
            string? sortBy = null, 
            bool includeCategory = false, 
            bool includeBrand = false 
        );
        Task<int> GetTotalProductCountAsync(string? search = null, int? categoryId = null, int? brandId = null, decimal? minPrice = null, decimal? maxPrice = null);
    }
}