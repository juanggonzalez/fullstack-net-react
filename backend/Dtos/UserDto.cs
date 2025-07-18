using System.Collections.Generic;

namespace FullstackNetReact.Dtos
{
    public class UserDto
    {
        public string Id { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public List<string> Roles { get; set; } = new List<string>();
        public List<AddressDto> Addresses { get; set; } = new List<AddressDto>();
    }
}