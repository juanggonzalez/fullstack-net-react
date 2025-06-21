using AutoMapper;
using EcommerceApi.Data;
using EcommerceApi.Dtos;
using EcommerceApi.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EcommerceApi.Services
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
                                        .Include(p => p.Brand) // Incluir Brand si lo usas
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

        public async Task<ProductDto> CreateProductAsync(ProductCreateDto productDto)
        {
            var product = _mapper.Map<Product>(productDto);
            product.CreatedAt = DateTime.UtcNow;
            product.UpdatedAt = DateTime.UtcNow;

            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return _mapper.Map<ProductDto>(product);
        }

        public async Task<bool> UpdateProductAsync(ProductUpdateDto productDto)
        {
            var product = await _context.Products.FindAsync(productDto.Id);
            if (product == null) return false;

            _mapper.Map(productDto, product); // Mapea los cambios del DTO al modelo existente
            product.UpdatedAt = DateTime.UtcNow; // Actualiza la fecha de modificación

            _context.Entry(product).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
                return true;
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _context.Products.AnyAsync(e => e.Id == productDto.Id))
                {
                    return false;
                }
                else
                {
                    throw;
                }
            }
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

            product.Stock = stockDto.NewStock;
            product.UpdatedAt = DateTime.UtcNow;

            _context.Entry(product).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
                return true;
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _context.Products.AnyAsync(e => e.Id == stockDto.Id))
                {
                    return false;
                }
                else
                {
                    throw;
                }
            }
        }

        public async Task<IEnumerable<ProductDto>> GetFilteredProductsAsync(
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
        )
        {
            IQueryable<Product> query = _context.Products;

            // Aplicar inclusiones
            if (includeCategory)
            {
                query = query.Include(p => p.Category);
            }
            if (includeBrand)
            {
                query = query.Include(p => p.Brand);
            }

            // Aplicar filtros
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

            // Aplicar ordenamiento
            query = sortBy?.ToLower() switch
            {
                "priceasc" => query.OrderBy(p => p.Price),
                "pricedesc" => query.OrderByDescending(p => p.Price),
                "nameasc" => query.OrderBy(p => p.Name),
                "namedesc" => query.OrderByDescending(p => p.Name),
                _ => query.OrderBy(p => p.Id) // Orden por defecto
            };

            // Aplicar paginación
            query = query.Skip((pageNumber - 1) * pageSize).Take(pageSize);

            var products = await query.ToListAsync();
            return _mapper.Map<IEnumerable<ProductDto>>(products);
        }

        public async Task<int> GetTotalProductCountAsync(string? search = null, int? categoryId = null, int? brandId = null, decimal? minPrice = null, decimal? maxPrice = null)
        {
            IQueryable<Product> query = _context.Products;

            // Aplicar los mismos filtros que en GetFilteredProductsAsync para obtener el conteo correcto
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