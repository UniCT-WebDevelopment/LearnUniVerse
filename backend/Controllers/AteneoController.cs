
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LearnUniVerse.Data;
using LearnUniVerse.Model;

namespace LearnUniVerse.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AteneoController : ControllerBase
    {
        private readonly DbContextClass _context;

        public AteneoController(DbContextClass context)
        {
            _context = context;
        }

        [HttpGet]
        [Route("AteneiList")]
        public async Task<ActionResult<IEnumerable<Ateneo>>> Get()
        {
 
            var atenei = await _context.Atenei.ToListAsync();
            return atenei;

        }




        [HttpGet]
        [Route("AteneoDetail")]
        public async Task<ActionResult<Ateneo>> Get(int id)
        {
            return await _context.Atenei.FindAsync(id);

        }


        [HttpPost]
        [Route("CreateAteneo")]
        public async Task<ActionResult<Ateneo>> POST(Ateneo atenei)
        {
            _context.Atenei.Add(atenei);

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(Get), new { id = atenei.Id }, atenei);
        }

        [HttpPost]
        [Route("DeleteAteneo")]
        public async Task<ActionResult<IEnumerable<Ateneo>>> Delete(int id)
        {
            var atenei = await _context.Atenei.FindAsync(id);
            if (atenei == null)
            {
                return NotFound();
            }
            _context.Atenei.Remove(atenei);

            await _context.SaveChangesAsync();

            return await _context.Atenei.ToListAsync();
        }


        [HttpPost]
        [Route("UpdateAteneo")]
        public async Task<ActionResult<IEnumerable<Ateneo>>> Update(int id, Ateneo atenei)
        {
            if (id != atenei.Id)
            {
                return BadRequest();
            }

            var ateneiData = await _context.Atenei.FindAsync(id);
            if (ateneiData == null)
            {
                return NotFound();
            }

           //mappare campo per campo. 
          

            await _context.SaveChangesAsync();
            return await _context.Atenei.ToListAsync();
        }
    }
}
