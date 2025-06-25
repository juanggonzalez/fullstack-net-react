using FullstackNetReact.Models;
using FullstackNetReact.Dtos;

namespace FullstackNetReact.Services
{
    public interface IAuthService
    {
        Task<Tuple<bool, IEnumerable<string>>> RegisterUserAsync(RegisterDto registerDto);
        Task<LoginResponseDto?> LoginUserAsync(LoginDto loginDto); 
    }
}