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
    public class FeedbacksController : ControllerBase
    {
        private readonly NewRoadReadyContext _context;
        private readonly ILogger<WeatherForecastController> _logger;
        public FeedbacksController(NewRoadReadyContext context, ILogger<WeatherForecastController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/Feedbacks
        [HttpGet]
        [Authorize(Roles = "Admin, Customer")]

        public async Task<ActionResult<IEnumerable<Feedback>>> GetFeedbacks()
        {
          if (_context.Feedbacks == null)
          {
              return NotFound();
          }
            return await _context.Feedbacks.ToListAsync();
        }

        // GET: api/Feedbacks/5
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin, Customer")]

        public async Task<ActionResult<Feedback>> GetFeedback(int id)
        {
          if (_context.Feedbacks == null)
          {
              return NotFound();
          }
            var feedback = await _context.Feedbacks.FindAsync(id);

            if (feedback == null)
            {
                return NotFound();
            }

            return feedback;
        }

        [HttpGet("GetAllFeedbacksForCars")]
        public async Task<ActionResult<IEnumerable<object>>> GetAllFeedbacksForCars()
        {
            var feedbacks = await _context.Feedbacks
                .Join(_context.Customers,
                      feedback => feedback.CustomerId,
                      customer => customer.CustomerId,
                      (feedback, customer) => new
                      {
                          CarMakeModel = _context.CarListings
                                         .Where(car => car.CarId == feedback.CarId)
                                         .Select(car => car.Make + " " + car.Model)
                                         .FirstOrDefault(),


                          FeedbackId =feedback.FeedbackId,
                          CustomerName = customer.FirstName + " " + customer.LastName,
                          Rating = feedback.Rating,
                          Review = feedback.Review,
                          ReviewDateTime = feedback.ReviewDateTime
                      })
                .ToListAsync();

            if (feedbacks == null || !feedbacks.Any())
            {
                return NotFound("No reviews available for any car");
            }

            return feedbacks;
        }


        //[HttpGet("customer/{customerId}")]
        //[Authorize(Roles = "Admin, Customer")]
        //public async Task<ActionResult<IEnumerable<Feedback>>> GetFeedbackByCustomerId(int customerId)
        //{

        //    var feedback = await _context.Feedbacks
        //                                .Where(f => f.CustomerId == customerId)
        //                                .ToListAsync();

        //    if (feedback == null || !feedback.Any())
        //    {
        //        return NotFound("No feedback found for the customer");
        //    }

        //    return feedback;
        //}


        [HttpGet("GetFeedbacksForCar/{carId}")]
        public async Task<ActionResult<IEnumerable<object>>> GetFeedbacksForCar(int carId)
        {

            var feedbacks = await _context.Feedbacks
                .Where(f => f.CarId == carId)
                .Join(_context.Customers,
                      feedback => feedback.CustomerId,
                      customer => customer.CustomerId,
                      (feedback, customer) => new
                      {
                          FeedbackId = feedback.FeedbackId,
                          CustomerName = customer.FirstName + " " + customer.LastName,
                          Rating = feedback.Rating,
                          Review = feedback.Review,
                          ReviewDateTime = feedback.ReviewDateTime
                      })
                .ToListAsync();

            if (feedbacks == null || !feedbacks.Any())
            {
                return NotFound("No reviews available for this car");
            }

            return feedbacks;
        }

        [HttpGet("GetFeedbacksByCustomerId/{custId}")]
        public async Task<ActionResult<IEnumerable<object>>> GetFeedbacksByCustomerId(int custId)
        {
            var customerId = await _context.Logins
              .Where(l => l.LoginId == custId)
              .Select(l => l.CustomerId)
              .FirstOrDefaultAsync();

            var feedbacks = await (from feedback in _context.Feedbacks
                                   join car in _context.CarListings on feedback.CarId equals car.CarId
                                   where feedback.CustomerId == customerId
                                   select new
                                   {
                                       FeedbackId=feedback.FeedbackId,
                                       CarMake = car.Make,
                                       CarModel = car.Model,
                                       ImageUrl = car.ImageUrl,
                                       ReviewDateTime = feedback.ReviewDateTime,
                                       Review = feedback.Review,
                                       Rating = feedback.Rating
                                   }).ToListAsync();


            if (feedbacks == null || !feedbacks.Any())
            {
                return NotFound("No reviews available for this customer");
            }

            return feedbacks;
        }


        // PUT: api/Feedbacks/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        [Authorize(Roles = "Customer")]

        public async Task<IActionResult> PutFeedback(int id, Feedback feedback)
        {
            if (id != feedback.FeedbackId)
            {
                return BadRequest();
            }

            _context.Entry(feedback).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FeedbackExists(id))
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

        // POST: api/Feedbacks
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Authorize(Roles = "Customer")]

        public async Task<ActionResult<Feedback>> PostFeedback(Feedback feedback)
        {
            // Get the CustomerId associated with the provided LoginId
            var customerId = _context.Logins
                .Where(l => l.LoginId == feedback.CustomerId)
                .Select(l => l.CustomerId)
                .FirstOrDefault();

            if (customerId == default(int))
            {
                return BadRequest("Invalid LoginId or Customer not found.");
            }

            // Assign the retrieved CustomerId to the reservation
            feedback.CustomerId = customerId;
            if (_context.Feedbacks == null)
          {
              return Problem("Entity set 'NewRoadReadyContext.Feedbacks'  is null.");
          }
            _context.Feedbacks.Add(feedback);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetFeedback", new { id = feedback.FeedbackId }, feedback);
        }


        // DELETE: api/Feedbacks/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin, Customer")]

        public async Task<IActionResult> DeleteFeedback(int id)
        {
            if (_context.Feedbacks == null)
            {
                return NotFound();
            }
            var feedback = await _context.Feedbacks.FindAsync(id);
            if (feedback == null)
            {
                return NotFound();
            }

            _context.Feedbacks.Remove(feedback);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool FeedbackExists(int id)
        {
            return (_context.Feedbacks?.Any(e => e.FeedbackId == id)).GetValueOrDefault();
        }
    }
}
