// FullstackNetReact/Dtos/ReviewDto.cs
// (No hay cambios en este archivo, se mantiene como en la respuesta anterior)

using System;

namespace FullstackNetReact.Dtos
{
    public class ReviewDto
    {
        public int Id { get; set; }
        public string UserName { get; set; } = string.Empty;
        public int Rating { get; set; } // 1 a 5 estrellas
        public string Comment { get; set; } = string.Empty;
        public DateTime ReviewDate { get; set; }
    }
}