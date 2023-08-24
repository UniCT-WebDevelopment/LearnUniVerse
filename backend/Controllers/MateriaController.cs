
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LearnUniVerse.Data;
using LearnUniVerse.Model;

namespace LearnUniVerse.Controllers
{
    [Route("api/[controller]")]
    [ApiController, Authorize]
    public class MateriaController : ControllerBase
    {
        private readonly DbContextClass _context;

        public MateriaController(DbContextClass context)
        {
            _context = context;
        }

        [HttpGet]
        [Route("MaterieList")]
        public async Task<ActionResult<IEnumerable<Materia>>> Get()
        {

            var materie = await _context.Materie.ToListAsync();
            return materie;

        }


        [HttpGet]
        [Route("GetMaterieOfCorso/{id}")]
        public async Task<ActionResult<IEnumerable<Materia>>> GetMaterieOfCorso(int id)
        {

            var materie = await _context.Materie.Where(c=> c.IdCorsoDiStudi == id).ToListAsync();
            return materie;

        }



        [HttpGet]
        [Route("MateriaDetail")]
        public async Task<ActionResult<Materia>> Get(int id)
        {
            return await _context.Materie.FindAsync(id);

        }


        [HttpPost]
        [Route("CreateMateria")]
        public async Task<ActionResult<Materia>> POST(Materia materie)
        {
            _context.Materie.Add(materie);

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(Get), new { id = materie.Id }, materie);
        }

        [HttpPost]
        [Route("DeleteMateria")]
        public async Task<ActionResult<IEnumerable<Materia>>> Delete(int id)
        {
            var materie = await _context.Materie.FindAsync(id);
            if (materie == null)
            {
                return NotFound();
            }
            _context.Materie.Remove(materie);

            await _context.SaveChangesAsync();

            return await _context.Materie.ToListAsync();
        }


        [HttpPost]
        [Route("UpdateMateria")]
        public async Task<ActionResult<IEnumerable<Materia>>> Update(int id, Materia materie)
        {
            if (id != materie.Id)
            {
                return BadRequest();
            }

            var materieData = await _context.Materie.FindAsync(id);
            if (materieData == null)
            {
                return NotFound();
            }

            //mappare campo per campo. 


            await _context.SaveChangesAsync();
            return await _context.Materie.ToListAsync();
        }
    }
}
