   using System.ComponentModel.DataAnnotations.Schema;

namespace LearnUniVerse.Model
{
    public class Corso
    {
        public int? Id { get; set; }
        public int IdUtente { get; set; }
        public int  IdMateria { get; set; }

        [ForeignKey("IdUtente")]
        public virtual Utente? Utente { get; set; }

        [ForeignKey("IdMateria")]
        public virtual Materia? Materia { get; set; }


    }
}
