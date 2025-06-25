using System.ComponentModel.DataAnnotations;

namespace FullstackNetReact.Dtos
{
    public class ProductCreateDto
    {
        [Required]
        [StringLength(200, MinimumLength = 3)]
        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }

        [Required]
        [StringLength(50, MinimumLength = 3)]
        public string Sku { get; set; } = string.Empty;

        [Required]
        [Range(0.01, 1000000.00, ErrorMessage = "Price must be greater than 0")]
        public decimal Price { get; set; }

        public string? ImageUrl { get; set; }

        [Required]
        [Range(0, int.MaxValue)]
        public int Stock { get; set; }

        [Required]
        public int CategoryId { get; set; }

        public int? BrandId { get; set; } 
    }
}