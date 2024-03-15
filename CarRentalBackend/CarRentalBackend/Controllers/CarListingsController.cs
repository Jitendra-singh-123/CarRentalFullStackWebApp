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
    public class CarListingsController : ControllerBase
    {
        private readonly NewRoadReadyContext _context;

        public CarListingsController(NewRoadReadyContext context)
        {
            _context = context;
        }

        // GET: api/CarListings
        [HttpGet]
        [Authorize(Roles = "Admin, Customer")]

        public async Task<ActionResult<IEnumerable<CarListing>>> GetCarListings()
        {
          if (_context.CarListings == null)
          {
              return NotFound();
          }
            return await _context.CarListings.ToListAsync();
        }

        // GET: api/CarListings/5
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin, Customer")]

        public async Task<ActionResult<CarListing>> GetCarListing(int id)
        {
          if (_context.CarListings == null)
          {
              return NotFound();
          }
            var carListing = await _context.CarListings.FindAsync(id);

            if (carListing == null)
            {
                return NotFound();
            }

            return carListing;
        }

        // PUT: api/CarListings/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> PutCarListing(int id, [FromForm] CarListing carListing, IFormFile img)
        {
            //Console.WriteLine(id);
            //Console.WriteLine(img);
            //Console.WriteLine(carListing);

            if (_context.CarListings == null)
            {
                return NotFound();
            }
            var existCar = await _context.CarListings.FindAsync(id);
            if (existCar == null)
            {
                return NotFound();
            }


            if (id != existCar.CarId)
            {
                return BadRequest();
            }



            // Check if status is valid
            if (carListing.Status != "Available" && carListing.Status != "Not Available")
            {
                return Conflict("Enter Status Should be Available or Not Available ");
            }

            // Check if available from date is less than available to date
            if (carListing.AvailableFrom >= carListing.AvailableTo)
            {
                return Conflict("AvailableFrom Data should be less than Available to date");
            }

            if (img != null && img.Length > 0)
            {
                using (var memoryStream = new MemoryStream())
                {
                    await img.CopyToAsync(memoryStream);
                    carListing.ImageUrl = Convert.ToBase64String(memoryStream.ToArray());
                    existCar.ImageUrl = carListing.ImageUrl;
                }
            }
            existCar.Make = carListing.Make;
            existCar.Model = carListing.Model;
            existCar.Location = carListing.Location;
            existCar.Specifications = carListing.Specifications;
            existCar.DailyRate = carListing.DailyRate;
            existCar.AvailableFrom = carListing.AvailableFrom;
            existCar.AvailableTo = carListing.AvailableTo;
            existCar.CarPlateNumber = carListing.CarPlateNumber;
            existCar.Status = carListing.Status;
            existCar.Year = carListing.Year;
            existCar.Color = carListing.Color;
            existCar.Mileage = carListing.Mileage;
            existCar.CarType = carListing.CarType;
            existCar.Transmission = carListing.Transmission;
            existCar.MaintenanceStatus = carListing.MaintenanceStatus;


            try
            {
                _context.Entry(existCar).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CarListingExists(id))
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

        // POST: api/CarListings
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<CarListing>> PostCarListing([FromForm] CarListing carListing, IFormFile img)
        {
            // Check if the car plate number is unique
            var existingPlateNumber = _context.CarListings.FirstOrDefault(c => c.CarPlateNumber == carListing.CarPlateNumber);
            if (existingPlateNumber != null)
            {
                return Conflict("Car Plate Number Already exists");
            }

            // Check if status is valid
            if (carListing.Status != "Available" && carListing.Status != "Not Available")
            {

                return Conflict("Enter Status Should be Available or Not Available ");
            }

            // Check if available from date is less than available to date
            if (carListing.AvailableFrom >= carListing.AvailableTo)
            {
                return Conflict("AvailableFrom Data should be less than Available to date");
            }

            if (img != null && img.Length > 0)
            {
                using (var memoryStream = new MemoryStream())
                {
                    await img.CopyToAsync(memoryStream);
                    carListing.ImageUrl = Convert.ToBase64String(memoryStream.ToArray());
                }
            }

            if (_context.CarListings == null)
            {
                return Problem("Entity set 'NewRoadReadyContext.CarListings' is null.");
            }

            _context.CarListings.Add(carListing);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCarListing", new { id = carListing.CarId }, carListing);
        }


        // DELETE: api/CarListings/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]

        public async Task<IActionResult> DeleteCarListing(int id)
        {
            if (_context.CarListings == null)
            {
                return NotFound();
            }
            var carListing = await _context.CarListings.FindAsync(id);
            if (carListing == null)
            {
                return NotFound();
            }

            _context.CarListings.Remove(carListing);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CarListingExists(int id)
        {
            return (_context.CarListings?.Any(e => e.CarId == id)).GetValueOrDefault();
        }
    }
}
