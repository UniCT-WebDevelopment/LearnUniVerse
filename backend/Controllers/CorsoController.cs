
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LearnUniVerse.Data;
using LearnUniVerse.Model;
 
namespace LearnUniVerse.Controllers
{
    [Route("api/[controller]")]
    [ApiController, Authorize]
    public class CorsoController : ControllerBase
    {
        private readonly DbContextClass _context;

        public CorsoController(DbContextClass context)
        {
            _context = context;
        }

        [HttpGet]
        [Route("CorsiList")]
        public async Task<ActionResult<IEnumerable<Corso>>> Get()
        {

            var corsi = await _context.Corsi.Where(x => 1 == 1).Include(c => c.Materia).Include(c => c.Utente).ThenInclude(c => c.Ateneo).ToListAsync();
            return corsi;

        }

        [HttpGet]
        [Route("GetCategorieDisponibili")]
        public async Task<ActionResult<IEnumerable<object>>> GetCategorieDisponibili()
        {

            List<object> resList = new List<object>();

            var corsi = _context.Corsi.Where(x => 1 == 1).Include(c=> c.Utente).ToList();

            var corsiDiStudi = _context.CorsoDiStudi.ToList();

            var res = corsiDiStudi.Where(c => corsi.Any(x => x.Utente.IdCorsoDiStudi == c.Id)).ToList();

            foreach (var corso in corsiDiStudi)
            {
                var numeroCorsi = corsi.Count(c => c.Utente.IdCorsoDiStudi == corso.Id);
                if (numeroCorsi == 0) continue;
                var temp = new
                {
                    id = corso.Id,
                    nome = corso.NomeCorso,
                    numeroCorsi = numeroCorsi
                };
                resList.Add(temp);

            }

            return resList;

        }


        [HttpGet]
        [Route("GetCorsiOfCategoria/{id}")]
        public async Task<ActionResult<IEnumerable<object>>> GetCorsiOfCategoria(int id)
        {



            var corsi = _context.Corsi.Where(c => 1 == 1).Include(c=> c.Materia).Include(c=> c.Utente).Where(c => c.Utente.IdCorsoDiStudi == id).ToList();/*(c => c.Utente.IdCorsoDiStudi == id);*/

            var corsiPerMateria = corsi.GroupBy(c => c.Materia)
                             .Select(group => new
                             {
                                 id = group.Key.Id,
                                 nome = group.Key.Nome,
                                 numeroTutor = group.Count()
                             })
                             .ToList();

            return corsiPerMateria;

        }


        [HttpGet]
        [Route("GetTutorOfMateria/{id}")]
        public async Task<ActionResult<IEnumerable<object>>> GetTutorOfMateria(int id)
        {
            List<object> resList = new List<object>();

            var corsi = _context.Corsi.Where(c => c.IdMateria == id).Include(c=> c.Utente).ThenInclude(c=> c.Ateneo).ToList();
            foreach (var corso in corsi)
            {
                var temp = new
                {
                    id = corso.Id,
                    nome = corso.Utente.Nome + " " + corso.Utente.Cognome,
                    universita = corso.Utente.Ateneo.NomeAteneo,
                    voto = 5
                };
                resList.Add(temp);
            }
            return resList;

        }


        [HttpGet]
        [AllowAnonymous]
        [Route("GetCorsiOfTutor/{id}")]
        public async Task<ActionResult<IEnumerable<object>>> GetCorsiOfTutor(int id)
        {
            var corsi = _context.Corsi.Where(c => c.IdUtente == id).Include(c => c.Materia).ToList();
            return corsi;

        }


        [HttpGet]
        [Route("CorsoDetail/{id}")]
        public async Task<ActionResult<Corso>> Get(int id)
        {
            return await _context.Corsi.Where(c => c.Id == id).Include(c => c.Utente).Include(c => c.Materia).FirstOrDefaultAsync();

        }


        [HttpPost]
        [Route("CreateCorso")]
        public async Task<ActionResult<Corso>> POST(Corso corsi)
        {
           


            _context.Corsi.Add(corsi);

            await _context.SaveChangesAsync();


            string path = "videos";
            string idUser = corsi.IdUtente.ToString();

            path = Path.Combine(path, corsi.Id.ToString());
            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }

            string sourceDir = Path.Combine("temp", idUser);

            if (Directory.Exists(sourceDir))
            {
                string[] files = Directory.GetFiles(sourceDir);

                // Copy each file to the destination directory
                foreach (string file in files)
                {
                    string fileName = Path.GetFileName(file);
                    string destFile = Path.Combine(path, fileName);
                    System.IO.File.Copy(file, destFile, true); // The third parameter "true" indicates to overwrite the destination file if it already exists
                    System.IO.File.Delete(file);
                    Console.WriteLine($"Copied {fileName} to {path}");
                }
            }
           


           

            return CreatedAtAction(nameof(Get), new { id = corsi.Id }, corsi);
        }


        //[HttpGet]
        //[Route("getVideo/{videoFileName}/{idcorso}")]
        //public ActionResult GetVideo(string videoFileName, int idcorso)
        //{
        //    var videoFilePath = Path.Combine("videos", idcorso.ToString());
        //    videoFilePath = Path.Combine(videoFilePath, videoFileName);

        //    if (System.IO.File.Exists(videoFilePath))
        //    {
        //        var videoBytes = System.IO.File.ReadAllBytes(videoFilePath);
        //        var videoStream = new MemoryStream(videoBytes);
        //        return new FileStreamResult(videoStream, "video/mp4"); // Change the content type accordingly
        //    }

        //    return NotFound();
        //}


        [HttpGet]
        [Route("getVideo/{videoFileName}/{idcorso}")]
        public IActionResult GetVideo(string videoFileName, int idcorso)
        {
            // Replace "path/to/your/file.pdf" with the actual path to your file

            var videoFilePath = Path.Combine("videos", idcorso.ToString());

            videoFilePath = Path.Combine(videoFilePath, videoFileName);
            var filePath = videoFilePath;
            var fileName = videoFileName;

            // Check if the file exists
            if (!System.IO.File.Exists(filePath))
            {
                return NotFound();
            }

            var fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read);

            // Return the file as a response
            return File(fileStream, "video/mp4", fileName);
        }


        [HttpPost]
        [Route("DeleteCorso")]
        public async Task<ActionResult<IEnumerable<Corso>>> Delete(int id)
        {
            var corsi = await _context.Corsi.FindAsync(id);
            if (corsi == null)
            {
                return NotFound();
            }
            _context.Corsi.Remove(corsi);

            await _context.SaveChangesAsync();

            return await _context.Corsi.ToListAsync();
        }


        [HttpPost]
        [Route("UpdateCorso")]
        public async Task<ActionResult<IEnumerable<Corso>>> Update(int id, Corso corsi)
        {
            if (id != corsi.Id)
            {
                return BadRequest();
            }

            var corsiData = await _context.Corsi.FindAsync(id);
            if (corsiData == null)
            {
                return NotFound();
            }

            string path = "videos";
            string idUser = corsi.IdUtente.ToString();

            path = Path.Combine(path, corsi.Id.ToString());
            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }

            string sourceDir = Path.Combine("temp", idUser);

            if (Directory.Exists(sourceDir))
            {
                string[] files = Directory.GetFiles(sourceDir);

                // Copy each file to the destination directory
                foreach (string file in files)
                {
                    string fileName = Path.GetFileName(file);
                    string destFile = Path.Combine(path, fileName);
                    System.IO.File.Copy(file, destFile, true); // The third parameter "true" indicates to overwrite the destination file if it already exists
                    System.IO.File.Delete(file);
                    Console.WriteLine($"Copied {fileName} to {path}");
                }
            }

            corsiData.IdMateria = corsi.IdMateria;

            await _context.SaveChangesAsync();
            return await _context.Corsi.ToListAsync();
        }
    }
}
