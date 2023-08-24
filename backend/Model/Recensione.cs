using System.ComponentModel.DataAnnotations.Schema;

namespace LearnUniVerse.Model
{
    public class Recensione
    {
        public int Id { get; set; }
        public int IdCorso { get; set; }
        public int IdUtente { get; set; }
        public int NumStelle { get; set; }


    }
}
