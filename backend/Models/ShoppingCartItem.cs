using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FullstackNetReact.Models
{
    public class ShoppingCartItem
    {
        public int Id { get; set; }

        public int ProductId { get; set; }
        public Product? Product { get; set; } 

        public int Quantity { get; set; }

        [Column(TypeName = "decimal(18, 2)")]
        public decimal PriceAtAddition { get; set; } 

        public DateTime AddedAt { get; set; } = DateTime.UtcNow;

        [Required]
        public string ShoppingCartId { get; set; } = string.Empty; 
        public ShoppingCart? ShoppingCart { get; set; } 
        public ICollection<ShoppingCartItem> ShoppingCartItems { get; set; } = new List<ShoppingCartItem>(); 
        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>(); 
    }
}