using AutoMapper;
using EcommerceApi.Models;
using EcommerceApi.Dtos;

namespace EcommerceApi.Profiles
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

            // Mapeo de Categoría
            CreateMap<Category, CategoryDto>();

            // Mapeo de Marca 
            CreateMap<Brand, BrandDto>();
        }
    }
}