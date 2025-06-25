// FullstackNetReact/Models/Review.cs
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FullstackNetReact.Models
{
    public class Review
    {
        [Key]
        public int Id { get; set; }

        public int ProductId { get; set; } // Foreign key to Product
        [ForeignKey("ProductId")]
        public Product Product { get; set; } = null!; 

        [Required]
        [MaxLength(100)]
        public string UserName { get; set; } = string.Empty;

        [Range(1, 5)] 
        public int Rating { get; set; }

        [MaxLength(1000)]
        public string? Comment { get; set; }

        public DateTime ReviewDate { get; set; } = DateTime.UtcNow; 
    }
}