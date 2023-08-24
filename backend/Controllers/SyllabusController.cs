
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LearnUniVerse.Data;
using LearnUniVerse.Model;

namespace LearnUniVerse.Controllers
{
    [Route("api/[controller]")]
    [ApiController, Authorize]
    public class SyllabusController : ControllerBase
    {
        private readonly DbContextClass _context;
        private const string UploadDirectory = "temp"; // Replace with your desired directory path

        public SyllabusController(DbContextClass context)
        {
            _context = context;
        }

        [HttpGet]
        [Route("SyllabusList")]
        public async Task<ActionResult<IEnumerable<Syllabus>>> Get()
        {

            var syllabus = await _context.Syllabus.ToListAsync();
            return syllabus;

        }


        [HttpPost("UploadFile/{userId}")]
        [AllowAnonymous]
        public async Task<IActionResult> UploadFile(IFormFile file, int userId)
        {
            if (file == null || file.Length == 0)
                return BadRequest("Invalid file");

            string fileName = Path.GetFileName(file.FileName);
            string filePath = Path.Combine(UploadDirectory, userId.ToString());
            Directory.CreateDirectory(filePath);

            filePath = Path.Combine(filePath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return Ok(new { message = "File uploaded successfully" });
        }



        [HttpGet]
        [Route("SyllabusDetail")]
        public async Task<ActionResult<Syllabus>> Get(int id)
        {
            return await _context.Syllabus.FindAsync(id);

        }

        [HttpGet]
        [Route("GetSyllabusFromCorso/{idCorso}")]
        public async Task<ActionResult<List<Syllabus>>> GetSyllabusFromCorso(int idCorso)
        {
            return await _context.Syllabus.Where(c => c.IdCorso == idCorso).ToListAsync() ;

        }



        [HttpPost]
        [Route("CreateSyllabus")]
        public async Task<ActionResult<Syllabus>> POST(Syllabus syllabus)
        {
            _context.Syllabus.Add(syllabus);

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(Get), new { id = syllabus.Id }, syllabus);
        }

        [HttpPost]
        [Route("UpdateSyllabusList")]
        public async Task<ActionResult> UpdateSyllabusList(int idCorso, List<Syllabus> syllabus)
        {
            var toDelete = _context.Syllabus.Where(x => x.IdCorso == idCorso).ToList();
            toDelete.ForEach(item => _context.Syllabus.Remove(item));

            _context.Syllabus.AddRange(syllabus);

            await _context.SaveChangesAsync();

            return Ok();
        }


        [HttpPost]
        [Route("CreateSyllabusList")]
        public async Task<ActionResult> CreateSyllabusList(List<Syllabus> syllabus)
        {
            _context.Syllabus.AddRange(syllabus.ToList());

            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpPost]
        [Route("DeleteSyllabus")]
        public async Task<ActionResult<IEnumerable<Syllabus>>> Delete(int id)
        {
            var syllabus = await _context.Syllabus.FindAsync(id);
            if (syllabus == null)
            {
                return NotFound();
            }
            _context.Syllabus.Remove(syllabus);

            await _context.SaveChangesAsync();

            return await _context.Syllabus.ToListAsync();
        }


        [HttpPost]
        [Route("UpdateSyllabus")]
        public async Task<ActionResult<IEnumerable<Syllabus>>> Update(int id, Syllabus syllabus)
        {
            if (id != syllabus.Id)
            {
                return BadRequest();
            }

            var syllabusData = await _context.Syllabus.FindAsync(id);
            if (syllabusData == null)
            {
                return NotFound();
            }

            //mappare campo per campo. 


            await _context.SaveChangesAsync();
            return await _context.Syllabus.ToListAsync();
        }
    }
}
