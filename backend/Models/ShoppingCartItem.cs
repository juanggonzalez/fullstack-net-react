using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FullstackNetReact.Models
{
    public class ShoppingCartItem
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int ProductId { get; set; } 

        [ForeignKey("ProductId")]
        public Product Product { get; set; } 

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "La cantidad debe ser al menos 1.")]
        public int Quantity { get; set; }

        [Required]
        public int ShoppingCartId { get; set; } 

        [ForeignKey("ShoppingCartId")]
        public ShoppingCart ShoppingCart { get; set; } 

        public decimal PriceAtTimeOfAddition { get; set; } 

        public DateTime AddedAt { get; set; } = DateTime.UtcNow;
    }
}
