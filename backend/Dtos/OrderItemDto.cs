namespace FullstackNetReact.Dtos
{
    public class OrderItemDto
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty; 
        public string? ProductImageUrl { get; set; } 
        public int Quantity { get; set; }
        public decimal Price { get; set; } 
    }
}
