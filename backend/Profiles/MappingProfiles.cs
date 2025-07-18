using AutoMapper;
using FullstackNetReact.Models;
using FullstackNetReact.Dtos;

namespace FullstackNetReact.Profiles
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            // Mapeo de Producto
            CreateMap<Product, ProductDto>()
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category != null ? src.Category.Name : string.Empty))
                .ForMember(dest => dest.BrandName, opt => opt.MapFrom(src => src.Brand != null ? src.Brand.Name : null))
                .ForMember(dest => dest.ImageUrl, opt => opt.MapFrom(src => src.ImageUrl));

            // Mapeo Acciones del Producto
            CreateMap<ProductCreateDto, Product>();
            CreateMap<ProductUpdateDto, Product>();
            CreateMap<ProductStockUpdateDto, Product>();

            // Mapeo Detalle del Producto
            CreateMap<Product, ProductDetailDto>()
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category != null ? src.Category.Name : string.Empty))
                .ForMember(dest => dest.BrandName, opt => opt.MapFrom(src => src.Brand != null ? src.Brand.Name : null))
                .ForMember(dest => dest.ImageUrl, opt => opt.MapFrom(src => src.ImageUrl))
                .ForMember(dest => dest.SellerName, opt => opt.MapFrom(src => src.Seller != null ? src.Seller.Name : string.Empty))
                .ForMember(dest => dest.SellerContact, opt => opt.MapFrom(src => src.Seller != null ? src.Seller.ContactInfo : string.Empty))
                .ForMember(dest => dest.Reviews, opt => opt.MapFrom(src => src.Reviews)) // Mapear colección de Reviews
                .ForMember(dest => dest.Features, opt => opt.MapFrom(src => src.Features.Select(f => f.FeatureText).ToList())) // Mapear solo el texto de las features
                .ForMember(dest => dest.TotalReviews, opt => opt.MapFrom(src => src.Reviews.Count))
                .ForMember(dest => dest.AverageRating, opt => opt.MapFrom(src => src.Reviews.Any() ? src.Reviews.Average(r => r.Rating) : 0));

            // Mapeo del Cart
            CreateMap<ShoppingCart, ShoppingCartDto>()
            .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src.Items));

            // Mapeo de Item de Cart
            CreateMap<ShoppingCartItem, CartItemDto>()
                .ForMember(dest => dest.ProductId, opt => opt.MapFrom(src => src.ProductId))
                .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product.Name))
                .ForMember(dest => dest.ProductImageUrl, opt => opt.MapFrom(src => src.Product.ImageUrl))
                .ForMember(dest => dest.ProductPrice, opt => opt.MapFrom(src => src.PriceAtTimeOfAddition));

            // Mapeo de Categoría
            CreateMap<Category, CategoryDto>();

            // Mapeo de Marca
            CreateMap<Brand, BrandDto>();

            // Mapeo de Review
            CreateMap<Review, ReviewDto>();

            // Mapeo de Feature
            CreateMap<ProductFeature, ProductFeatureDto>();

            // Mapeo de Vendedor
            CreateMap<Seller, SellerDto>();

            // Mapeo de Direccion
            CreateMap<Address, AddressDto>().ReverseMap(); 

            // Mapeo de Orden
            CreateMap<Order, OrderDto>()
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()))
                .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src.OrderItems))
                .ForMember(dest => dest.ShippingAddress, opt => opt.MapFrom(src => src.ShippingAddress)) 
                .ForMember(dest => dest.BillingAddress, opt => opt.MapFrom(src => src.BillingAddress)); 

            // Mapero de Item de la Orden
            CreateMap<OrderItem, OrderItemDto>()
                .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product.Name))
                .ForMember(dest => dest.ProductImageUrl, opt => opt.MapFrom(src => src.Product.ImageUrl))
                .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.PriceAtOrder)); 
        }
    }
}