using System.ComponentModel.DataAnnotations;

namespace FullstackNetReact.Dtos
{
    public class ProductStockUpdateDto
    {
        [Required]
        public int Id { get; set; }

        [Required]
        [Range(0, int.MaxValue, ErrorMessage = "Stock must be non-negative")]
        public int Stock { get; set; }
    }
}