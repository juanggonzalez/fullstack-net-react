using System.ComponentModel.DataAnnotations;

namespace FullstackNetReact.Dtos 
{
    public class RegisterDto
    {
        [Required(ErrorMessage = "El nombre de usuario es requerido.")]
        public string Username { get; set; }

        [Required(ErrorMessage = "La contraseña es requerida.")]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "La contraseña debe tener al menos 6 y un máximo de 100 caracteres de longitud.")]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Compare("Password", ErrorMessage = "La contraseña y la contraseña de confirmación no coinciden.")]
        [Required(ErrorMessage = "La confirmación de contraseña es requerida.")] 
        public string ConfirmPassword { get; set; } 

        [Required(ErrorMessage = "El email es requerido.")]
        [EmailAddress(ErrorMessage = "Formato de email inválido.")]
        public string Email { get; set; }

        [MaxLength(100, ErrorMessage = "El nombre no puede exceder los 100 caracteres.")]
        public string? FirstName { get; set; } 

        [MaxLength(100, ErrorMessage = "El apellido no puede exceder los 100 caracteres.")]
        public string? LastName { get; set; } 
    }
}