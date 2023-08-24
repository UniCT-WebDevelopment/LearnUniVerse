using System.ComponentModel.DataAnnotations;

namespace LearnUniVerse.Model
{
    public class MessageDto
    {
        public string From { get; set; }
        public string To { get; set; }
        public string Content { get; set; }
        public int? IdCorso { get; set; }
    }
}
