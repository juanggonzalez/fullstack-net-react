using Microsoft.AspNetCore.Mvc;
using FullstackNetReact.Dtos; 
using FullstackNetReact.Services;
using FullstackNetReact.Models; 

namespace FullstackNetReact.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService; 

        public AuthController(IAuthService authService) 
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
            

            var result = await _authService.RegisterUserAsync(registerDto);

            if (!result.Item1) 
            {
                
                return BadRequest(new { title = "Error al registrar el usuario.", errors = result.Item2 });
            }

            return Ok(new { message = "Usuario registrado exitosamente." });
        }
    }
}