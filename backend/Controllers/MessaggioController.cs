
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LearnUniVerse.Data;
using LearnUniVerse.Model;

namespace LearnUniVerse.Controllers
{
    [Route("api/[controller]")]
    [ApiController, Authorize]
    public class MessaggioController : ControllerBase
    {
        private readonly DbContextClass _context;

        public MessaggioController(DbContextClass context)
        {
            _context = context;
        }

        [HttpGet]
        [Route("MessaggioList")]
        public async Task<ActionResult<IEnumerable<Messaggio>>> Get()
        {

            var Messaggio = await _context.Messaggi.ToListAsync();
            return Messaggio;

        }

        [HttpGet]
        [Route("GetMessaggiCorso/{idCorso}")]
        public async Task<ActionResult<IEnumerable<Messaggio>>> GetMessaggiCorso(int idCorso)
        {

            var Messaggio = await _context.Messaggi.Where(C => C.IdCorso == idCorso ).ToListAsync();


            return Messaggio;

        }



        [HttpGet]
        [Route("GetMessaggiToMe/{user}")]
        public async Task<ActionResult<IEnumerable<Messaggio>>> GetMessaggiToMe(string user)
        {

            var Messaggio = await _context.Messaggi.Where(C => C.To.Trim() == user.Trim()).ToListAsync();


            return Messaggio;

        }

        [HttpGet]
        [Route("GetListOfChat/{user}")]
        public async Task<ActionResult<IEnumerable<object>>> GetListOfChat(string user)
        {

            var Messaggio = await _context.Messaggi.Where(C => C.To.Trim() == user.Trim()).ToListAsync();

            var ret = Messaggio.GroupBy(c => c.From)
                .Select(group => new
                {
                    from = group.Key,
                    messages = group.Select(c => c)
                }).ToList();



            return ret;

        }


        [HttpGet]
        [Route("GetMessaggiFromMeToOther/{userFrom}/{userOther}")]
        public async Task<ActionResult<IEnumerable<Messaggio>>> GetMessaggiToMe(string userFrom, string userOther)
        {

            var Messaggio = await _context.Messaggi.Where(C => C.To.Trim() == userOther.Trim() && C.From.Trim() == userFrom.Trim()).ToListAsync();


            return Messaggio;

        }



        [HttpGet]
        [Route("MessaggioDetail")]
        public async Task<ActionResult<Messaggio>> Get(int id)
        {
            return await _context.Messaggi.FindAsync(id);

        }


        [HttpPost]
        [Route("CreateMessaggio")]
        public async Task<ActionResult<Messaggio>> POST(Messaggio Messaggio)
        {
            _context.Messaggi.Add(Messaggio);

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(Get), new { id = Messaggio.Id }, Messaggio);
        }

        [HttpPost]
        [Route("DeleteMessaggio")]
        public async Task<ActionResult<IEnumerable<Messaggio>>> Delete(int id)
        {
            var Messaggio = await _context.Messaggi.FindAsync(id);
            if (Messaggio == null)
            {
                return NotFound();
            }
            _context.Messaggi.Remove(Messaggio);

            await _context.SaveChangesAsync();

            return await _context.Messaggi.ToListAsync();
        }


        [HttpPost]
        [Route("UpdateMessaggio")]
        public async Task<ActionResult<IEnumerable<Messaggio>>> Update(int id, Messaggio Messaggio)
        {
            if (id != Messaggio.Id)
            {
                return BadRequest();
            }

            var MessaggioData = await _context.Messaggi.FindAsync(id);
            if (MessaggioData == null)
            {
                return NotFound();
            }

            //mappare campo per campo. 


            await _context.SaveChangesAsync();
            return await _context.Messaggi.ToListAsync();
        }
    }
}
