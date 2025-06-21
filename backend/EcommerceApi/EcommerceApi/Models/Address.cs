using System.ComponentModel.DataAnnotations;

namespace EcommerceApi.Models
{
    public class Address
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Street { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string City { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string State { get; set; } = string.Empty;

        [Required]
        [MaxLength(10)]
        public string PostalCode { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string Country { get; set; } = string.Empty;

        public bool IsDefaultShipping { get; set; }
        public bool IsDefaultBilling { get; set; }

        [Required]
        public string UserId { get; set; } = string.Empty; 
        public ApplicationUser? User { get; set; } 
    }
}