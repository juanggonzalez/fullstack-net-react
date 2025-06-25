namespace FullstackNetReact.Dtos
{
    public class ProductDetailDto : ProductDto
    {
        public List<string> Features { get; set; } = new List<string>();
        public string SellerName { get; set; } = string.Empty;
        public string SellerContact { get; set; } = string.Empty;
        public double AverageRating { get; set; }
        public int TotalReviews { get; set; }
        public List<ReviewDto> Reviews { get; set; } = new List<ReviewDto>();
    }
}