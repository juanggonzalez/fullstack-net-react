using EcommerceApi.Dtos; 
using EcommerceApi.Models;
using fullstack_net_react.Dtos; 

namespace EcommerceApi.Services
{
    public interface IAuthService
    {
        Task<Tuple<bool, IEnumerable<string>>> RegisterUserAsync(RegisterDto registerDto);
        Task<LoginResponseDto?> LoginUserAsync(LoginDto loginDto); 
    }
}