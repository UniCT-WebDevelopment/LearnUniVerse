using System.ComponentModel.DataAnnotations.Schema;

namespace LearnUniVerse.Model
{
    public class Materia
    {
        public int? Id { get; set; }
        public string Nome { get; set; }
        public int IdCorsoDiStudi { get; set; }


    }
}
