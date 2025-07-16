namespace FullstackNetReact.Dtos
{
    public class ShoppingCartDto
    {
        public int Id { get; set; } 
        public string UserId { get; set; }
        public List<CartItemDto> Items { get; set; } = new List<CartItemDto>();
        public decimal TotalPrice => Items.Sum(item => item.LineTotal);
    }
}
