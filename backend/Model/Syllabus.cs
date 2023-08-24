using System.ComponentModel.DataAnnotations.Schema;

namespace LearnUniVerse.Model
{
    public class Syllabus
    {
        public int? Id { get; set; }
        public int IdCorso { get; set; }
        public int NumLezione { get; set; }
        public string ArgomentoLezione { get; set; }

        [ForeignKey("IdCorso")]
        public virtual Corso? Corso { get; set; }
    }


}
