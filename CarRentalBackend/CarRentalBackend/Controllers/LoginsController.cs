using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CarRentalBackend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Cors;

namespace CarRentalBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginsController : ControllerBase
    {
        private readonly NewRoadReadyContext _context;
        private readonly IConfiguration _configuration;
        private readonly ILogger<WeatherForecastController> _logger;
        public LoginsController(NewRoadReadyContext context, IConfiguration configuration, ILogger<WeatherForecastController> logger)
        {
            _context = context;
            _configuration = configuration;
            _logger = logger;
        }
        // GET: api/Logins
        [HttpGet]
        [Authorize(Roles = "Admin, Customer")]

        public async Task<ActionResult<IEnumerable<Login>>> GetLogins()
        {
          if (_context.Logins == null)
          {
              return NotFound();
          }
            return await _context.Logins.ToListAsync();
        }

        // GET: api/Logins/5
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin, Customer")]

        public async Task<ActionResult<Login>> GetLogin(int id)
        {
          if (_context.Logins == null)
          {
              return NotFound();
          }
            var login = await _context.Logins.FindAsync(id);

            if (login == null)
            {
                return NotFound();
            }

            return login;
        }

        // PUT: api/Logins/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        [Authorize(Roles = "Customer")]

        public async Task<IActionResult> PutLogin(int id, Login login)
        {
            if (id != login.LoginId)
            {
                return BadRequest();
            }

            _context.Entry(login).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LoginExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }


        [HttpPut("ChangePassword/{no}")]

        public async Task<IActionResult> UpdateLogin([FromBody] Login logins)
        {
            var email = logins.Email;

            Login user = null;
            // Retrieve the user record based on the provided email and role
            if (logins.Role == "Admin")
            {
                user = await _context.Logins.FirstOrDefaultAsync(l => l.Email == email && l.Role == "Admin");
            }
            else if (logins.Role == "Customer")
            {
                user = await _context.Logins.FirstOrDefaultAsync(l => l.Email == email && l.Role == "Customer");
            }

            if (user == null)
            {
                return NotFound("User not found");
            }

            // Update the password for the user
            user.Password = logins.Password;
            
            try
            {
                // Save the changes to the database
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (DbUpdateConcurrencyException)
            {
                return NotFound("User not found");

            }
        }



        //POST: api/Logins
        //To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public IActionResult Authenticate([FromBody] Login user)
        {
            var _user = _context.Logins.FirstOrDefault(u => u.Email == user.Email && u.Password == user.Password && u.Role == user.Role);

            if (_user == null)
                return Unauthorized();

            var issuer = _configuration["Jwt:Issuer"];
            var audience = _configuration["Jwt:Audience"];
            var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]);
            var signingCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature);
            //var subject = new ClaimsIdentity(new[] { new Claim(JwtRegisteredClaimNames.Sub, _user.Email), new Claim(JwtRegisteredClaimNames.Email, _user.Email) });
            var subject = new ClaimsIdentity(new[]
            {
                // new Claim(JwtRegisteredClaimNames.Sub, _user.UserLoginId.ToString()),
                 new Claim(JwtRegisteredClaimNames.Sub, _user.Email),
                 new Claim(JwtRegisteredClaimNames.Email, _user.Email),
                 new Claim(ClaimTypes.Role, _user.Role)
            });

            var expires = DateTime.UtcNow.AddHours(1);
            var tokenDecription = new SecurityTokenDescriptor { Subject = subject, SigningCredentials = signingCredentials, Expires = expires, Issuer = issuer, Audience = audience };
            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDecription);
            var jwtToken = tokenHandler.WriteToken(token);

            // Return the JWT token in the response
            return Ok(new { jwtToken, user = _user });


        }

        //    [HttpPost]
        //    public IActionResult Authenticate([FromBody] Login user)
        //    {
        //        var email = user.Email;
        //        var password = user.Password;

        //        // Search for the user based on the provided email
        //        var foundUser = _context.Logins.FirstOrDefault(u => u.Email == email);

        //        if (foundUser == null)
        //        {
        //            // If no user is found with the provided email, return Unauthorized
        //            return Unauthorized();
        //        }

        //        // Check if the provided password matches the password stored in the database
        //        if (foundUser.Password != password)
        //        {
        //            // If passwords don't match, return Unauthorized
        //            return Unauthorized();
        //        }

        //        // Determine the role of the user
        //        var role = foundUser.Role;

        //        // Create claims for the JWT token
        //        var claims = new List<Claim>
        //{
        //    new Claim(JwtRegisteredClaimNames.Sub, foundUser.Email),
        //    new Claim(JwtRegisteredClaimNames.Email, foundUser.Email),
        //    new Claim(ClaimTypes.Role, role)
        //};

        //        var issuer = _configuration["Jwt:Issuer"];
        //        var audience = _configuration["Jwt:Audience"];
        //        var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]);
        //        var signingCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature);

        //        // Set expiration time for the token
        //        var expires = DateTime.UtcNow.AddHours(1);

        //        // Create token descriptor
        //        var tokenDescriptor = new SecurityTokenDescriptor
        //        {
        //            Subject = new ClaimsIdentity(claims),
        //            SigningCredentials = signingCredentials,
        //            Expires = expires,
        //            Issuer = issuer,
        //            Audience = audience
        //        };

        //        var tokenHandler = new JwtSecurityTokenHandler();

        //        // Create JWT token
        //        var token = tokenHandler.CreateToken(tokenDescriptor);

        //        // Write the token to a string
        //        var jwtToken = tokenHandler.WriteToken(token);

        //        // Return the JWT token along with user information
        //        return Ok(new { jwtToken, user = new { Email = foundUser.Email, Role = foundUser.Role , LoginId = foundUser.LoginId} });
        //    }



        // DELETE: api/Logins/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin, Customer")]

        public async Task<IActionResult> DeleteLogin(int id)
        {
            if (_context.Logins == null)
            {
                return NotFound();
            }
            var login = await _context.Logins.FindAsync(id);
            if (login == null)
            {
                return NotFound();
            }

            _context.Logins.Remove(login);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool LoginExists(int id)
        {
            return (_context.Logins?.Any(e => e.LoginId == id)).GetValueOrDefault();
        }
    }
}
