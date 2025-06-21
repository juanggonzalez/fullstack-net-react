// Backend/Controllers/AuthController.cs
using Microsoft.AspNetCore.Mvc;
using EcommerceApi.Dtos; // Asegúrate de importar tus DTOs
using EcommerceApi.Services;
using EcommerceApi.Models; // Asegúrate de importar tu servicio

namespace EcommerceApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService; // Inyecta la interfaz del servicio

        public AuthController(IAuthService authService) // Constructor modificado
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            var response = await _authService.LoginUserAsync(loginDto);

            if (response == null)
            {
                return Unauthorized(new { title = "Credenciales inválidas.", message = "Nombre de usuario o contraseña incorrectos." });
            }

            return Ok(response);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            // La validación de ModelState ya ocurre automáticamente antes de llegar aquí
            // Si hay errores de validación de DTO (ej. Required, StringLength, Compare),
            // el framework devuelve un 400 antes de que este método se ejecute.
            // Si el error es por Identity (ej. password policy), lo manejamos aquí.

            var result = await _authService.RegisterUserAsync(registerDto);

            if (!result.Item1) // Si el registro no fue exitoso
            {
                // result.Item2 contiene los errores como IEnumerable<string>
                return BadRequest(new { title = "Error al registrar el usuario.", errors = result.Item2 });
            }

            return Ok(new { message = "Usuario registrado exitosamente." });
        }
    }
}