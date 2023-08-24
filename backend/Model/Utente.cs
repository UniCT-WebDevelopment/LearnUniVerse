using System.ComponentModel.DataAnnotations.Schema;

namespace LearnUniVerse.Model
{
    public class Utente
    {
        public int? Id { get; set; }
        public string Nome { get; set; }
        public string Cognome { get; set; }
        public DateTime DataDiNascita { get; set; }
        public int AnnoImmatricolazione { get; set; }

        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public int IdAteneo { get; set; }
        public int IdCorsoDiStudi { get; set; }

        [ForeignKey("IdAteneo")]
        public virtual Ateneo? Ateneo { get; set; }

        [ForeignKey("IdCorsoDiStudi")]
        public virtual CorsoDiStudi? CorsoDiStudi { get; set; }
    }
}
