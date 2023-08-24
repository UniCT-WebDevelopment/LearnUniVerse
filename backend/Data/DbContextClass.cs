using Microsoft.EntityFrameworkCore;
using LearnUniVerse.Model;

namespace LearnUniVerse.Data
{
    public class DbContextClass : DbContext
    {
        protected readonly IConfiguration Configuration;

        public DbContextClass(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder options)
        {
            options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"));
        }
        public DbSet<Utente> Utenti { get; set; }
        public DbSet<Ateneo> Atenei { get; set; }
        public DbSet<CorsoDiStudi> CorsoDiStudi { get; set; }
        public DbSet<Corso> Corsi { get; set; }
        public DbSet<Syllabus> Syllabus { get; set; }
        public DbSet<Messaggio> Messaggi { get; set; }
        public DbSet<Recensione> Recensioni { get; set; }
        public DbSet<Materia> Materie { get; set; }





    }
}
