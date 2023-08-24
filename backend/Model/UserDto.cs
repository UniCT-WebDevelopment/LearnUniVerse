using System.ComponentModel.DataAnnotations;

namespace LearnUniVerse.Model
{
    public class UserDto
    {
        [Required]
        [StringLength(30, MinimumLength = 3, ErrorMessage = "Name must be at least {2} and max {1}")]
        public string Name { get; set; }
    }
}
