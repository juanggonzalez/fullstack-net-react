using System;

namespace FullstackNetReact.Dtos
{
    public class ReviewDto
    {
        public int Id { get; set; }
        public string UserName { get; set; } = string.Empty;
        public int Rating { get; set; } 
        public string Comment { get; set; } = string.Empty;
        public DateTime ReviewDate { get; set; }
    }
}