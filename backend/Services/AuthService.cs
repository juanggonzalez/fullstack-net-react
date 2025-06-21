// Backend/Services/AuthService.cs
using Microsoft.AspNetCore.Identity;
using System.IdentityModel.Tokens.Jwt; // Para JWT
using System.Security.Claims; // Para JWT
using System.Text; // Para JWT
using Microsoft.IdentityModel.Tokens; // Para JWT
using EcommerceApi.Dtos;
using EcommerceApi.Models;
using fullstack_net_react.Dtos; // Para ApplicationUser

namespace EcommerceApi.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IConfiguration _configuration;

        public AuthService(UserManager<ApplicationUser> userManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _configuration = configuration;
        }

        public async Task<Tuple<bool, IEnumerable<string>>> RegisterUserAsync(RegisterDto registerDto)
        {
            var user = new ApplicationUser
            {
                UserName = registerDto.Username,
                Email = registerDto.Email,
                EmailConfirmed = true, // Para desarrollo, puedes marcarlo como true
                FirstName = registerDto.FirstName,
                LastName = registerDto.LastName
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (!result.Succeeded)
            {
                return Tuple.Create(false, result.Errors.Select(e => e.Description));
            }

            // Asigna el rol por defecto (ej. "User")
            var roleResult = await _userManager.AddToRoleAsync(user, "User");
            if (!roleResult.Succeeded)
            {
                // Manejar si la asignación de rol falla (ej. borrar el usuario creado)
                await _userManager.DeleteAsync(user); // Opcional: borrar el usuario si el rol no se puede asignar
                return Tuple.Create(false, new List<string> { "Usuario registrado, pero no se pudo asignar el rol por defecto." } as IEnumerable<string>);
            }

            return Tuple.Create(true, Enumerable.Empty<string>());
        }

        public async Task<LoginResponseDto?> LoginUserAsync(LoginDto loginDto)
        {
            var user = await _userManager.FindByNameAsync(loginDto.Username);
            if (user == null || !await _userManager.CheckPasswordAsync(user, loginDto.Password))
            {
                return null; // Credenciales inválidas
            }

            // Lógica para generar JWT (moverla desde el controlador)
            var authClaims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Id) // Agrega el ID de usuario como Claim
            };

            var userRoles = await _userManager.GetRolesAsync(user);
            foreach (var role in userRoles)
            {
                authClaims.Add(new Claim(ClaimTypes.Role, role));
            }

            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                expires: DateTime.Now.AddHours(3), // Token válido por 3 horas
                claims: authClaims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
            );

            return new LoginResponseDto
            {
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                User = new UserDto // Crea un DTO simple para el usuario logeado si no tienes uno
                {
                    Id = user.Id,
                    Username = user.UserName,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Roles = userRoles.ToList()
                }
            };
        }
    }

    
}