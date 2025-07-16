using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FullstackNetReact.Models
{
    public class ProductFeature
    {
        [Key]
        public int Id { get; set; }

        public int ProductId { get; set; } 
        [ForeignKey("ProductId")]
        public Product Product { get; set; } = null!; 

        [Required]
        [MaxLength(200)]
        public string FeatureText { get; set; } = string.Empty;
    }
}