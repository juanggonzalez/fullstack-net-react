// FullstackNetReact/Models/ProductFeature.cs
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FullstackNetReact.Models
{
    public class ProductFeature
    {
        [Key]
        public int Id { get; set; }

        public int ProductId { get; set; } // Foreign key to Product
        [ForeignKey("ProductId")]
        public Product Product { get; set; } = null!; // Navigation property

        [Required]
        [MaxLength(200)]
        public string FeatureText { get; set; } = string.Empty;
    }
}