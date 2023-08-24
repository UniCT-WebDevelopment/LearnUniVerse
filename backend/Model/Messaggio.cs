using System.ComponentModel.DataAnnotations.Schema;

namespace LearnUniVerse.Model
{
    public class Messaggio
    {
        public int? Id { get; set; }
 
        public string? From { get; set; }
        public string? To { get; set; }

        public int? IdCorso { get; set; }

        public string? Content { get; set; }


    }
}
