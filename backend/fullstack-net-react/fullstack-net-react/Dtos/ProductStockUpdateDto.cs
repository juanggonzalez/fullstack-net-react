using System.ComponentModel.DataAnnotations;

namespace EcommerceApi.Dtos
{
    public class ProductStockUpdateDto
    {
        [Required]
        public int Id { get; set; }

        [Required]
        [Range(0, int.MaxValue, ErrorMessage = "Stock must be non-negative")]
        public int NewStock { get; set; }
    }
}