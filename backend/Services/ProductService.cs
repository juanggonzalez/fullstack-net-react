using AutoMapper;
using FullstackNetReact.Data;
using FullstackNetReact.Dtos;
using FullstackNetReact.Models;
using Microsoft.EntityFrameworkCore;

namespace FullstackNetReact.Services
{
    public class ProductService : IProductService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public ProductService(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<IEnumerable<ProductDto>> GetAllProductsAsync()
        {
            var products = await _context.Products
                                        .Include(p => p.Category)
                                        .Include(p => p.Brand)
                                        .ToListAsync();
            return _mapper.Map<IEnumerable<ProductDto>>(products);
        }

        public async Task<ProductDto?> GetProductByIdAsync(int id)
        {
            var product = await _context.Products
                                        .Include(p => p.Category)
                                        .Include(p => p.Brand)
                                        .FirstOrDefaultAsync(p => p.Id == id);
            return _mapper.Map<ProductDto>(product);
        }

        // MODIFICADO: GetProductDetailByIdAsync para usar la DB
        public async Task<ProductDetailDto?> GetProductDetailByIdAsync(int id)
        {
            var product = await _context.Products
                                        .Include(p => p.Category)
                                        .Include(p => p.Brand)
                                        .Include(p => p.Seller) // Incluir el vendedor
                                        .Include(p => p.Reviews) // Incluir las reseñas
                                        .Include(p => p.Features) // Incluir las características
                                        .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
            {
                return null;
            }

            var productDetailDto = _mapper.Map<ProductDetailDto>(product);

            // Mapeo manual de las características (ya que ProductDetailDto espera List<string>)
            productDetailDto.Features = product.Features.Select(f => f.FeatureText).ToList();

            // Calcular promedio de rating y total de reseñas
            productDetailDto.TotalReviews = product.Reviews.Count;
            productDetailDto.AverageRating = product.Reviews.Any() ? Math.Round(product.Reviews.Average(r => r.Rating), 1) : 0;

            return productDetailDto;
        }

        public async Task<ProductDto> CreateProductAsync(ProductCreateDto productDto)
        {
            var product = _mapper.Map<Product>(productDto);
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return _mapper.Map<ProductDto>(product);
        }

        public async Task<bool> UpdateProductAsync(ProductUpdateDto productDto)
        {
            var product = await _context.Products.FindAsync(productDto.Id);
            if (product == null) return false;

            _mapper.Map(productDto, product);
            _context.Products.Update(product);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteProductAsync(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return false;

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateProductStockAsync(ProductStockUpdateDto stockDto)
        {
            var product = await _context.Products.FindAsync(stockDto.Id);
            if (product == null) return false;

            product.Stock = stockDto.Stock;
            _context.Products.Update(product);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<ProductDto>> GetFilteredProductsAsync(
            string? search = null, int? categoryId = null, int? brandId = null,
            decimal? minPrice = null, decimal? maxPrice = null,
            int pageNumber = 1, int pageSize = 10, string? sortBy = null,
            bool includeCategory = false, bool includeBrand = false
        )
        {
            IQueryable<Product> query = _context.Products;

            if (includeCategory)
            {
                query = query.Include(p => p.Category);
            }
            if (includeBrand)
            {
                query = query.Include(p => p.Brand);
            }

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(p => p.Name.Contains(search) || p.Description!.Contains(search) || p.Sku.Contains(search));
            }

            if (categoryId.HasValue)
            {
                query = query.Where(p => p.CategoryId == categoryId.Value);
            }

            if (brandId.HasValue)
            {
                query = query.Where(p => p.BrandId == brandId.Value);
            }

            if (minPrice.HasValue)
            {
                query = query.Where(p => p.Price >= minPrice.Value);
            }

            if (maxPrice.HasValue)
            {
                query = query.Where(p => p.Price <= maxPrice.Value);
            }

            query = sortBy?.ToLowerInvariant() switch
            {
                "priceasc" => query.OrderBy(p => p.Price),
                "pricedesc" => query.OrderByDescending(p => p.Price),
                "nameasc" => query.OrderBy(p => p.Name),
                "namedesc" => query.OrderByDescending(p => p.Name),
                _ => query.OrderBy(p => p.Id)
            };

            query = query.Skip((pageNumber - 1) * pageSize).Take(pageSize);

            var products = await query.ToListAsync();
            return _mapper.Map<IEnumerable<ProductDto>>(products);
        }

        public async Task<int> GetTotalProductCountAsync(string? search = null, int? categoryId = null, int? brandId = null, decimal? minPrice = null, decimal? maxPrice = null)
        {
            IQueryable<Product> query = _context.Products;

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(p => p.Name.Contains(search) || p.Description!.Contains(search) || p.Sku.Contains(search));
            }

            if (categoryId.HasValue)
            {
                query = query.Where(p => p.CategoryId == categoryId.Value);
            }

            if (brandId.HasValue)
            {
                query = query.Where(p => p.BrandId == brandId.Value);
            }

            if (minPrice.HasValue)
            {
                query = query.Where(p => p.Price >= minPrice.Value);
            }

            if (maxPrice.HasValue)
            {
                query = query.Where(p => p.Price <= maxPrice.Value);
            }

            return await query.CountAsync();
        }
    }
}