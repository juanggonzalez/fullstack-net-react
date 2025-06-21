using EcommerceApi.Dtos;
using EcommerceApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EcommerceApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductsController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetProducts(
            [FromQuery] string? search,
            [FromQuery] int? categoryId,
            [FromQuery] int? brandId,
            [FromQuery] decimal? minPrice,
            [FromQuery] decimal? maxPrice,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? sortBy = null
        )
        {
            var products = await _productService.GetFilteredProductsAsync(
                search, categoryId, brandId, minPrice, maxPrice,
                pageNumber, pageSize, sortBy,
                includeCategory: true, 
                includeBrand: true 
            );

            var totalCount = await _productService.GetTotalProductCountAsync(search, categoryId, brandId, minPrice, maxPrice);
            Response.Headers.Append("X-Total-Count", totalCount.ToString());

            return Ok(products);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDto>> GetProduct(int id)
        {
            var product = await _productService.GetProductByIdAsync(id);

            if (product == null)
            {
                return NotFound();
            }

            return Ok(product);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ProductDto>> CreateProduct(ProductCreateDto productDto)
        {
            var createdProduct = await _productService.CreateProductAsync(productDto);
            return CreatedAtAction(nameof(GetProduct), new { id = createdProduct.Id }, createdProduct);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateProduct(int id, ProductUpdateDto productDto)
        {
            if (id != productDto.Id)
            {
                return BadRequest("Product ID mismatch.");
            }

            var success = await _productService.UpdateProductAsync(productDto);
            if (!success)
            {
                return NotFound();
            }

            return NoContent(); 
        }

        [HttpPatch("{id}/stock")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateProductStock(int id, ProductStockUpdateDto stockDto)
        {
            if (id != stockDto.Id)
            {
                return BadRequest("Product ID mismatch.");
            }

            var success = await _productService.UpdateProductStockAsync(stockDto);
            if (!success)
            {
                return NotFound();
            }

            return NoContent();
        }


        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var success = await _productService.DeleteProductAsync(id);
            if (!success)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}