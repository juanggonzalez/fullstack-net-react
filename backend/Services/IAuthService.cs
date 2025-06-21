// Backend/Services/IAuthService.cs (Crea esta carpeta si no existe)
using EcommerceApi.Dtos; // Asegúrate de que este namespace es correcto
using EcommerceApi.Models;
using fullstack_net_react.Dtos; // Para ApplicationUser

namespace EcommerceApi.Services
{
    public interface IAuthService
    {
        Task<Tuple<bool, IEnumerable<string>>> RegisterUserAsync(RegisterDto registerDto);
        Task<LoginResponseDto?> LoginUserAsync(LoginDto loginDto); // Puede devolver null si las credenciales son incorrectas
        // Otros métodos de autenticación/autorización si los necesitas (ej: ForgotPassword, ResetPassword, AssignRole)
    }
}