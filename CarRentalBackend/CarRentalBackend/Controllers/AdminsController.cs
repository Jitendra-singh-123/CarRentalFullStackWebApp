using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CarRentalBackend.Models;
using Microsoft.AspNetCore.Authorization;

namespace CarRentalBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminsController : ControllerBase
    {
        private readonly NewRoadReadyContext _context;

        public AdminsController(NewRoadReadyContext context)
        {
            _context = context;
        }

        // GET: api/Admins
        [HttpGet]
        [Authorize(Roles = "Admin")]

        public async Task<ActionResult<IEnumerable<Admin>>> GetAdmins()
        {
          if (_context.Admins == null)
          {
              return NotFound();
          }
            return await _context.Admins.ToListAsync();
        }

        // GET: api/Admins/5
        [HttpGet("{loginId}")]
        [Authorize(Roles = "Admin")]

        public async Task<ActionResult<Admin>> GetAdmin(int loginId)
        {
            var adminId = await _context.Logins
              .Where(l => l.LoginId == loginId)
              .Select(l => l.AdminId)
              .FirstOrDefaultAsync();
            if (_context.Admins == null)
          {
              return NotFound();
          }
            var admin = await _context.Admins.FindAsync(adminId);

            if (admin == null)
            {
                return NotFound();
            }

            return admin;
        }

        // PUT: api/Admins/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]

        public async Task<IActionResult> PutAdmin(int id, Admin admin)
        {
            if (id != admin.AdminId)
            {
                return BadRequest();
            }

            _context.Entry(admin).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AdminExists(id))
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

        // POST: api/Admins
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Admin>> PostAdmin(Admin admin)
        {
            var existingAdmin = await _context.Admins.FirstOrDefaultAsync(a => a.AdminId == admin.AdminId);
            var existingEmail = await _context.Admins.FirstOrDefaultAsync(a => a.Email  == admin.Email);
            if (existingAdmin != null)
            {
                return Conflict("Admin with the same Admin Id already exists.");
            }
            if (existingEmail != null)
            {
                return Conflict("Email Already Registered.");
            }

            if (_context.Admins == null)
          {
              return Problem("Entity set 'NewRoadReadyContext.Admins'  is null.");
          }
            _context.Admins.Add(admin);
            await _context.SaveChangesAsync();

            return Ok(admin);
        }

        // DELETE: api/Admins/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]

        public async Task<IActionResult> DeleteAdmin(int id)
        {
            if (_context.Admins == null)
            {
                return NotFound();
            }
            var admin = await _context.Admins.FindAsync(id);
            if (admin == null)
            {
                return NotFound();
            }

            _context.Admins.Remove(admin);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AdminExists(int id)
        {
            return (_context.Admins?.Any(e => e.AdminId == id)).GetValueOrDefault();
        }
    }
}
