
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
 using LearnUniVerse.Data;
using LearnUniVerse.Model;
 using System.Text;
 using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;

namespace LearnUniVerse.Controllers
{
    [Route("api/[controller]")]
    [ApiController, Authorize]
    public class UtenteController : ControllerBase
    {
        private readonly DbContextClass _context;

        public UtenteController(DbContextClass context)
        {
            _context = context;
        }

        [HttpGet]
        [Route("UtentiList")]
        public async Task<ActionResult<IEnumerable<Utente>>> Get()
        {

            var utente = await _context.Utenti.ToListAsync();
            return utente;

        }




        [HttpGet]
        [Route("UtenteDetail")]
        public async Task<ActionResult<Utente>> Get(int id)
        {
            return await _context.Utenti.FindAsync(id);

        }


        [HttpPost]
        [AllowAnonymous]
        [Route("CreateUtente")]
        public async Task<ActionResult<object>> POST(Utente utente)
        {
            var objres = new object();


            _context.Utenti.Add(utente);

            await _context.SaveChangesAsync();

            var claims = new List<Claim>();
            claims.Add(new Claim("id", "" + utente.Id));
            claims.Add(new Claim("nome", "" + utente.Nome));
            claims.Add(new Claim("cognome", "" + utente.Cognome));

            var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(ConfigurationManager.AppSetting["JWT:Secret"]));
            var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
            var tokeOptions = new JwtSecurityToken(
                issuer: ConfigurationManager.AppSetting["JWT:ValidIssuer"],
                audience: ConfigurationManager.AppSetting["JWT:ValidAudience"],
                claims:claims,
                expires: DateTime.Now.AddMinutes(600),
                signingCredentials: signinCredentials
            );
            var tokenString = new JwtSecurityTokenHandler().WriteToken(tokeOptions);

            objres = new
            {
                authtoken = tokenString
            };

            return Ok(objres);


        }

        [HttpPost]
        [Route("DeleteUtente")]
        public async Task<ActionResult<IEnumerable<Utente>>> Delete(int id)
        {
            var utente = await _context.Utenti.FindAsync(id);
            if (utente == null)
            {
                return NotFound();
            }
            _context.Utenti.Remove(utente);

            await _context.SaveChangesAsync();

            return await _context.Utenti.ToListAsync();
        }


        [HttpPost]
        [Route("UpdateUtente")]
        public async Task<ActionResult<IEnumerable<Utente>>> Update(int id, Utente utente)
        {
            if (id != utente.Id)
            {
                return BadRequest();
            }

            var utenteData = await _context.Utenti.FindAsync(id);
            if (utenteData == null)
            {
                return NotFound();
            }

            //mappare campo per campo. 


            await _context.SaveChangesAsync();
            return await _context.Utenti.ToListAsync();
        }
    }
}
