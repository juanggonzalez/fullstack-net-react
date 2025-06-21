// fullstack-net-react/Models/LoginDto.cs
using System.ComponentModel.DataAnnotations; // Para validaciones

namespace EcommerceApi.Models // Asegúrate que el namespace sea correcto
{
    public class LoginDto
    {
        [Required(ErrorMessage = "El nombre de usuario es requerido.")]
        public string Username { get; set; } = string.Empty;

        [Required(ErrorMessage = "La contraseña es requerida.")]
        [DataType(DataType.Password)]
        public string Password { get; set; } = string.Empty;
    }
}