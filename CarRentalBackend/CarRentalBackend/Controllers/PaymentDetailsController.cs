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
    public class PaymentDetailsController : ControllerBase
    {
        private readonly NewRoadReadyContext _context;
        private readonly ILogger<WeatherForecastController> _logger;
        public PaymentDetailsController(NewRoadReadyContext context, ILogger<WeatherForecastController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/PaymentDetails
        [HttpGet]
        [Authorize(Roles = "Admin, Customer")]
        public async Task<ActionResult<IEnumerable<PaymentDetail>>> GetPaymentDetails()
        {
            var paymentDetails = await _context.PaymentDetails
                .Join(_context.CarListings,
                    payment => payment.CarId,
                    car => car.CarId,
                    (payment, car) => new { Payment = payment, Car = car })
                .Join(_context.Customers,
                    paymentCar => paymentCar.Payment.CustomerId,
                    customer => customer.CustomerId,
                    (paymentCar, customer) => new PaymentDetail
                    {
                        PaymentId = paymentCar.Payment.PaymentId,
                        CustomerId = paymentCar.Payment.CustomerId,
                        CarId = paymentCar.Payment.CarId,
                        PaymentMethod = paymentCar.Payment.PaymentMethod,
                        AccountDetails = paymentCar.Payment.AccountDetails,
                        Amount = paymentCar.Payment.Amount,
                        TransactionStatus = paymentCar.Payment.TransactionStatus,
                        TransactionDate = paymentCar.Payment.TransactionDate,
                        Car = paymentCar.Car,
                        Customer = customer,
                      
                    })
                .ToListAsync();

            if (paymentDetails == null)
            {
                return NotFound();
            }

            return paymentDetails;
        }

        // GET: api/PaymentDetails/5
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin, Customer")]

        public async Task<ActionResult<PaymentDetail>> GetPaymentDetail(int id)
        {
          if (_context.PaymentDetails == null)
          {
              return NotFound();
          }
            var paymentDetail = await _context.PaymentDetails.FindAsync(id);

            if (paymentDetail == null)
            {
                return NotFound();
            }

            return paymentDetail;
        }

        // PUT: api/PaymentDetails/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin, Customer")]

        public async Task<IActionResult> PutPaymentDetail(int id, PaymentDetail paymentDetail)
        {
            if (id != paymentDetail.PaymentId)
            {
                return BadRequest();
            }

            _context.Entry(paymentDetail).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PaymentDetailExists(id))
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

        // POST: api/PaymentDetails
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Authorize(Roles = "Customer")]

        public async Task<ActionResult<PaymentDetail>> PostPaymentDetail(PaymentDetail paymentDetail)
        {
          if (_context.PaymentDetails == null)
          {
              return Problem("Entity set 'NewRoadReadyContext.PaymentDetails'  is null.");
          }
            _context.PaymentDetails.Add(paymentDetail);
            await _context.SaveChangesAsync();

            return Ok(paymentDetail);
        }

        // DELETE: api/PaymentDetails/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]

        public async Task<IActionResult> DeletePaymentDetail(int id)
        {
            if (_context.PaymentDetails == null)
            {
                return NotFound();
            }
            var paymentDetail = await _context.PaymentDetails.FindAsync(id);
            if (paymentDetail == null)
            {
                return NotFound();
            }

            _context.PaymentDetails.Remove(paymentDetail);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PaymentDetailExists(int id)
        {
            return (_context.PaymentDetails?.Any(e => e.PaymentId == id)).GetValueOrDefault();
        }
    }
}
