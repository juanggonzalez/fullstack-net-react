using System.ComponentModel.DataAnnotations;

namespace FullstackNetReact.Models
{
    public class ShoppingCart
    {
        [Key] 
        public string UserId { get; set; } = string.Empty; 

        public ApplicationUser? User { get; set; } 

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime LastModifiedAt { get; set; } = DateTime.UtcNow;

        public ICollection<ShoppingCartItem> Items { get; set; } = new List<ShoppingCartItem>();
    }
}