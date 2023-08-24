
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LearnUniVerse.Data;
using LearnUniVerse.Model;

namespace LearnUniVerse.Controllers
{
    [Route("api/[controller]")]
    [ApiController, Authorize]
    public class RecensioneController : ControllerBase
    {
        private readonly DbContextClass _context;

        public RecensioneController(DbContextClass context)
        {
            _context = context;
        }

        [HttpGet]
        [Route("RecensioneList")]
        public async Task<ActionResult<IEnumerable<Recensione>>> Get()
        {
 
            var Recensione = await _context.Recensioni.ToListAsync();
            return Recensione;

        }




        [HttpGet]
        [Route("RecensioneDetail")]
        public async Task<ActionResult<Recensione>> Get(int id)
        {
            return await _context.Recensioni.FindAsync(id);

        }


        [HttpPost]
        [Route("CreateRecensione")]
        public async Task<ActionResult<Recensione>> POST(Recensione Recensione)
        {
            _context.Recensioni.Add(Recensione);

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(Get), new { id = Recensione.Id }, Recensione);
        }

        [HttpPost]
        [Route("DeleteRecensione")]
        public async Task<ActionResult<IEnumerable<Recensione>>> Delete(int id)
        {
            var Recensione = await _context.Recensioni.FindAsync(id);
            if (Recensione == null)
            {
                return NotFound();
            }
            _context.Recensioni.Remove(Recensione);

            await _context.SaveChangesAsync();

            return await _context.Recensioni.ToListAsync();
        }


        [HttpPost]
        [Route("UpdateRecensione")]
        public async Task<ActionResult<IEnumerable<Recensione>>> Update(int id, Recensione Recensione)
        {
            if (id != Recensione.Id)
            {
                return BadRequest();
            }

            var RecensioneData = await _context.Recensioni.FindAsync(id);
            if (RecensioneData == null)
            {
                return NotFound();
            }

           //mappare campo per campo. 
          

            await _context.SaveChangesAsync();
            return await _context.Recensioni.ToListAsync();
        }
    }
}
