
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LearnUniVerse.Data;
using LearnUniVerse.Model;

namespace LearnUniVerse.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CorsoDiStudiController : ControllerBase
    {
        private readonly DbContextClass _context;

        public CorsoDiStudiController(DbContextClass context)
        {
            _context = context;
        }

        [HttpGet]
        [Route("CorsiDiStudiList")]
        public async Task<ActionResult<IEnumerable<CorsoDiStudi>>> Get()
        {

            var corsiDiStudi = await _context.CorsoDiStudi.ToListAsync();
            return corsiDiStudi;

        }




        [HttpGet]
        [Route("CorsoDiStudiDetail")]
        public async Task<ActionResult<CorsoDiStudi>> Get(int id)
        {
            return await _context.CorsoDiStudi.FindAsync(id);

        }


        [HttpPost]
        [Route("CreateCorsoDiStudi")]
        public async Task<ActionResult<CorsoDiStudi>> POST(CorsoDiStudi corsiDiStudi)
        {
            _context.CorsoDiStudi.Add(corsiDiStudi);

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(Get), new { id = corsiDiStudi.Id }, corsiDiStudi);
        }

        [HttpPost]
        [Route("DeleteCorsoDiStudi")]
        public async Task<ActionResult<IEnumerable<CorsoDiStudi>>> Delete(int id)
        {
            var corsiDiStudi = await _context.CorsoDiStudi.FindAsync(id);
            if (corsiDiStudi == null)
            {
                return NotFound();
            }
            _context.CorsoDiStudi.Remove(corsiDiStudi);

            await _context.SaveChangesAsync();

            return await _context.CorsoDiStudi.ToListAsync();
        }


        [HttpPost]
        [Route("UpdateCorsoDiStudi")]
        public async Task<ActionResult<IEnumerable<CorsoDiStudi>>> Update(int id, CorsoDiStudi corsiDiStudi)
        {
            if (id != corsiDiStudi.Id)
            {
                return BadRequest();
            }

            var corsiDiStudiData = await _context.CorsoDiStudi.FindAsync(id);
            if (corsiDiStudiData == null)
            {
                return NotFound();
            }

            //mappare campo per campo. 


            await _context.SaveChangesAsync();
            return await _context.CorsoDiStudi.ToListAsync();
        }
    }
}
