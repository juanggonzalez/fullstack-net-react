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

            CreateMap<ProductCreateDto, Product>();
            CreateMap<ProductUpdateDto, Product>();
            CreateMap<ProductStockUpdateDto, Product>();

            // Nuevo mapeo para ProductDetailDto
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


            // Mapeo de Categoría
            CreateMap<Category, CategoryDto>();

            // Mapeo de Marca
            CreateMap<Brand, BrandDto>();

            // Mapeo de Review
            CreateMap<Review, ReviewDto>();

            // Mapeo de Feature
            CreateMap<ProductFeature, ProductFeatureDto>();

            // Mapero de Vendedor
            CreateMap<Seller, SellerDto>();
        }
    }
}