// fullstack-net-react/Controllers/AuthController.cs

using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt; // Necesario para JwtSecurityToken
using Microsoft.IdentityModel.Tokens; // Necesario para SymmetricSecurityKey
using System.Text; // Necesario para Encoding.UTF8
using System.Threading.Tasks; // Necesario para async/await
using EcommerceApi.Models; // Asegúrate de que LoginDto, RegisterDto y ApplicationUser estén aquí
using Microsoft.Extensions.Configuration; // Para acceder a la configuración JWT

namespace EcommerceApi.Controllers // Asegúrate que el namespace sea correcto
{
    [Route("api/[controller]")] // La URL será /api/Auth
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager; // Para gestionar usuarios
        private readonly IConfiguration _configuration; // Para leer la clave JWT de appsettings.json

        public AuthController(UserManager<ApplicationUser> userManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _configuration = configuration;
        }

        [HttpPost("login")] // POST a /api/Auth/login
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            // Busca el usuario por nombre de usuario
            var user = await _userManager.FindByNameAsync(loginDto.Username);

            // Verifica si el usuario existe y si la contraseña es correcta
            if (user == null || !await _userManager.CheckPasswordAsync(user, loginDto.Password))
            {
                return Unauthorized(new { message = "Credenciales inválidas." });
            }

            // Obtener los roles del usuario
            var roles = await _userManager.GetRolesAsync(user);

            // Crear claims para el token JWT
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id), // ID único del usuario
                new Claim(ClaimTypes.Name, user.UserName),     // Nombre de usuario
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()) // JWT ID único para este token
            };

            // Añadir los roles como claims al token
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            // Obtener la clave secreta y credenciales para firmar el token
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // Crear el token JWT
            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],     // Emisor del token (tu API)
                audience: _configuration["Jwt:Audience"], // Audiencia del token (tu frontend)
                claims: claims,                           // Claims del usuario y roles
                expires: DateTime.Now.AddMinutes(30),     // El token expira en 30 minutos desde ahora
                signingCredentials: creds                 // Credenciales de firma
            );

            // Devolver el token JWT
            return Ok(new { token = new JwtSecurityTokenHandler().WriteToken(token) });
        }

        [HttpPost("register")] // POST a /api/Auth/register
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            // 1. Validar si el usuario o email ya existen
            if (await _userManager.FindByNameAsync(registerDto.Username) != null)
            {
                return BadRequest(new { message = "El nombre de usuario ya está en uso." });
            }
            if (await _userManager.FindByEmailAsync(registerDto.Email) != null)
            {
                return BadRequest(new { message = "El correo electrónico ya está registrado." });
            }

            // 2. Crear una nueva instancia de tu ApplicationUser
            var user = new ApplicationUser
            {
                UserName = registerDto.Username,
                Email = registerDto.Email,
                EmailConfirmed = true, // Para desarrollo, puedes marcarlo como true
                FirstName = registerDto.FirstName, // Asigna las propiedades adicionales
                LastName = registerDto.LastName
                // CreatedAt y UpdatedAt se inicializan en el modelo ApplicationUser
            };

            // 3. Intenta crear el usuario con la contraseña proporcionada. Identity hashea la contraseña.
            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (!result.Succeeded)
            {
                // Si la creación falla, devuelve los errores de validación de Identity
                var errors = result.Errors.Select(e => e.Description);
                return BadRequest(new { message = "Error al registrar el usuario.", errors = errors });
            }

            // 4. Asigna el rol por defecto (ej. "User") al nuevo usuario
            var roleResult = await _userManager.AddToRoleAsync(user, "User");
            if (!roleResult.Succeeded)
            {
                // Si falla la asignación de rol, podrías querer manejarlo (ej. borrar el usuario creado)
                return StatusCode(500, new { message = "Usuario registrado, pero no se pudo asignar el rol por defecto." });
            }

            return Ok(new { message = "Usuario registrado exitosamente." });
        }
    }
}