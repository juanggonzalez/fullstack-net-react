using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FullstackNetReact.Models
{
    public enum OrderStatus
    {
        Pending,
        Processing,
        Shipped,
        Delivered,
        Cancelled
    }

    public class Order
    {
        public int Id { get; set; }

        [Required]
        public string UserId { get; set; } = string.Empty; // FK a ApplicationUser
        public ApplicationUser? User { get; set; } 

        [Column(TypeName = "decimal(18, 2)")]
        public decimal TotalAmount { get; set; }

        public DateTime OrderDate { get; set; } = DateTime.UtcNow;

        public OrderStatus Status { get; set; } = OrderStatus.Pending;

        [MaxLength(50)]
        public string? PaymentMethod { get; set; } 

        [MaxLength(200)]
        public string? PaymentStatus { get; set; } 

        public int ShippingAddressId { get; set; }
        public Address? ShippingAddress { get; set; }

        public int BillingAddressId { get; set; }
        public Address? BillingAddress { get; set; }

        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}