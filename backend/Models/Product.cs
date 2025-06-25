// FullstackNetReact/Models/Product.cs
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic; // Para ICollection

namespace FullstackNetReact.Models
{
    public class Product
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(255)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? Description { get; set; }

        [Required]
        [MaxLength(50)]
        public string Sku { get; set; } = string.Empty;

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        [MaxLength(500)]
        public string? ImageUrl { get; set; }

        [Required]
        [Range(0, int.MaxValue)]
        public int Stock { get; set; }

        // Foreign Key for Category
        public int CategoryId { get; set; }
        [ForeignKey("CategoryId")]
        public Category Category { get; set; } = null!;

        // Foreign Key for Brand (optional, can be null)
        public int? BrandId { get; set; }
        [ForeignKey("BrandId")]
        public Brand? Brand { get; set; }

        // --- Propiedades para reseñas, características y vendedor ---
        public int? SellerId { get; set; } // Foreign key para Seller
        [ForeignKey("SellerId")]
        public Seller? Seller { get; set; } // Propiedad de navegación

        public ICollection<Review> Reviews { get; set; } = new List<Review>(); // Reseñas de este producto
        public ICollection<ProductFeature> Features { get; set; } = new List<ProductFeature>(); // Características adicionales

        // --- NUEVAS PROPIEDADES PARA RESOLVER LOS ERRORES ---
        public ICollection<ShoppingCartItem> ShoppingCartItems { get; set; } = new List<ShoppingCartItem>();
        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}