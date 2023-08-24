
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using LearnUniVerse.Model;
using LearnUniVerse.Data;

namespace LearnUniVerse.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {

        private readonly DbContextClass _context;

        public AuthenticationController(DbContextClass context)
        {
            _context = context;
        }



        [HttpPost("login")]
        public async Task<ActionResult<JWTTokenResponse>> Login([FromBody] Login user)
        {
            if (user is null)
            {
                return BadRequest("Invalid user request!!!");
            }

            var res = _context.Utenti.Where(c => c.Email == user.UserName && c.PasswordHash == user.Password);

            var claims = new List<Claim>();


            if (res.Count() == 1)
            {
                claims.Add(new Claim("id", "" + res.First().Id));
                claims.Add(new Claim("nome", "" + res.First().Nome));
                claims.Add(new Claim("cognome", "" + res.First().Cognome));

                var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(ConfigurationManager.AppSetting["JWT:Secret"]));
                var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
                var tokeOptions = new JwtSecurityToken(
                    issuer: ConfigurationManager.AppSetting["JWT:ValidIssuer"],
                    audience: ConfigurationManager.AppSetting["JWT:ValidAudience"],
                    claims: claims,
                    expires: DateTime.Now.AddMinutes(600),
                    signingCredentials: signinCredentials
                );
                var tokenString = new JwtSecurityTokenHandler().WriteToken(tokeOptions);
                return Ok(new JWTTokenResponse { Token = tokenString });
            }
            return Unauthorized();
        }
    }
}
