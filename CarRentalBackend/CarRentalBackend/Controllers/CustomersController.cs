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
    public class CustomersController : ControllerBase
    {
        private readonly NewRoadReadyContext _context;

        public CustomersController(NewRoadReadyContext context)
        {
            _context = context;
        }

        // GET: api/Customers
        [HttpGet]
        [Authorize(Roles = "Admin")]

        public async Task<ActionResult<IEnumerable<Customer>>> GetCustomers()
        {
          if (_context.Customers == null)
          {
              return NotFound();
          }
            return await _context.Customers.ToListAsync();
        }

        // GET: api/Customers/5
        [HttpGet("{loginId}")]
        [Authorize(Roles = "Admin, Customer")]

        public async Task<ActionResult<Customer>> GetCustomer(int loginId)
        {
            // Retrieve the customerId associated with the loginId
            var customerId = await _context.Logins
                .Where(l => l.LoginId == loginId)
                .Select(l => l.CustomerId)
                .FirstOrDefaultAsync();
            if (_context.Customers == null)
          {
              return NotFound();
          }
            var customer = await _context.Customers.FindAsync(customerId);

            if (customer == null)
            {
                return NotFound();
            }

            return customer;
        }

        //[HttpPut("ChangePassword/{no}")]

        //public async Task<IActionResult> UpdateLogin(string email, [FromBody] Customer cust)
        //{
        //    if (email != cust.EmailAddress)
        //    {
        //        return BadRequest("Email mismatch");
        //    }

        //    // Retrieve the user record based on the provided email
        //    var user = await _context.Customers.FirstOrDefaultAsync(c => c.EmailAddress == email);

        //    if (user == null)
        //    {
        //        return NotFound("User not found");
        //    }

        //    // Update the password for the user
        //    user.Password = cust.Password;

        //    try
        //    {
        //        // Save the changes to the database
        //        await _context.SaveChangesAsync();
        //        return NoContent();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        return NotFound("User not found");

        //    }
        //}


        // PUT: api/Customers/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{loginId}")]
        [Authorize(Roles = "Admin, Customer")]

        public async Task<IActionResult> PutCustomer(int loginId, Customer customer)
        {

            var customerId = await _context.Logins
               .Where(l => l.LoginId == loginId)
               .Select(l => l.CustomerId)
               .FirstOrDefaultAsync();
            if (loginId != customer.CustomerId)
            {
                return BadRequest();
            }

            _context.Entry(customer).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CustomerExists(loginId))
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

        // POST: api/Customers
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754


        [HttpPost]
        public async Task<ActionResult<Customer>> PostCustomer(Customer customer)
        {
            if (_context.Customers == null)
            {
                return Problem("Entity set 'NewRoadReadyContext.Customers' is null.");
            }

            // Check if the customer with the same CustomerId exists
            var existingCustomer = await _context.Customers.FirstOrDefaultAsync(c => c.CustomerId == customer.CustomerId);
            var existingLicense = await _context.Customers.FirstOrDefaultAsync(c => c.LicenseNumber == customer.LicenseNumber);
            var existingEmail = await _context.Customers.FirstOrDefaultAsync(c => c.EmailAddress == customer.EmailAddress);

            if (existingCustomer != null)
            {
                return Conflict("Customer with the same CustomerId already exists.");
            }

            if (existingLicense != null)
            {
                return Conflict("License Number already exists.");
            }

            if (existingEmail != null)
            {
                return Conflict("Email Already Registered.");
            }

            // Neither CustomerId nor LicenseNumber nor EmailAddress exists, proceed to add the customer to the table
            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();

            return Ok(customer);
        }
        // DELETE: api/Customers/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin, Customer")]

        public async Task<IActionResult> DeleteCustomer(int id)
        {
            if (_context.Customers == null)
            {
                return NotFound();
            }
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null)
            {
                return NotFound();
            }

            _context.Customers.Remove(customer);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CustomerExists(int id)
        {
            return (_context.Customers?.Any(e => e.CustomerId == id)).GetValueOrDefault();
        }
    }
}
