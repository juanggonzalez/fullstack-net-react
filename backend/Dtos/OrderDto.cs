using System;
using System.Collections.Generic;

namespace FullstackNetReact.Dtos
{
    public class OrderDto
    {
        public int Id { get; set; }
        public DateTime OrderDate { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } 
        public string? PaymentMethod { get; set; }
        public string? PaymentStatus { get; set; }

        public AddressDto? ShippingAddress { get; set; }
        public AddressDto? BillingAddress { get; set; }

        public ICollection<OrderItemDto> Items { get; set; } = new List<OrderItemDto>();
    }

}