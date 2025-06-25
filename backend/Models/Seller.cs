// FullstackNetReact/Models/Seller.cs
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace FullstackNetReact.Models
{
    public class Seller
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(200)]
        public string? ContactInfo { get; set; } // e.g., email, phone, website

        public ICollection<Product> Products { get; set; } = new List<Product>(); // Products sold by this seller
    }
}