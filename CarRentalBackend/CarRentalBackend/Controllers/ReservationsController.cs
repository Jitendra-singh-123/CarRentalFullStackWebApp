using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CarRentalBackend.Models;
using Microsoft.AspNetCore.Authorization;
using System.Runtime.ConstrainedExecution;

namespace CarRentalBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReservationsController : ControllerBase
    {
        private readonly NewRoadReadyContext _context;

        public ReservationsController(NewRoadReadyContext context)
        {
            _context = context;
        }

        // GET: api/Reservations
        [HttpGet]
        [Authorize(Roles = "Admin, Customer")]

        public async Task<ActionResult<IEnumerable<Reservation>>> GetReservations()
        {
            if (_context.Reservations == null)
            {
                return NotFound();
            }
            return await _context.Reservations.ToListAsync();
        }


        [HttpGet("{id}")]
        [Authorize(Roles = "Admin, Customer")]
        public async Task<ActionResult<Reservation>> GetReservation(int id)
        {
            if (_context.Reservations == null)
            {
                return NotFound();
            }
            var reservation = await _context.Reservations.FindAsync(id);

            if (reservation == null)
            {
                return NotFound();
            }

            return reservation;
        }

        [HttpGet("customer/{loginId}")]
        [Authorize(Roles = "Admin, Customer")]
        public async Task<ActionResult<IEnumerable<object>>> GetReservations(int loginId)
        {
            // Retrieve the customerId associated with the loginId
            var customerId = await _context.Logins
                .Where(l => l.LoginId == loginId)
                .Select(l => l.CustomerId)
                .FirstOrDefaultAsync();

            if (customerId == default(int))
            {
                return NotFound("Customer not found for the provided loginId.");
            }

            // Retrieve reservations for the specified customer along with related car make, model, and other details
            var reservationsWithDetails = await _context.Reservations
                .Where(r => r.CustomerId == customerId)
                .Join(_context.CarListings,
                      reservation => reservation.CarId,
                      car => car.CarId,
                      (reservation, car) => new
                      {
                          AvailableFrom = car.AvailableFrom,
                          AvailableTo = car.AvailableTo,
                          ReservationID = reservation.ReservationId,
                          CustomerID = reservation.CustomerId,
                          PickUpTime = reservation.PickupDateTime,
                          DropOffTime = reservation.DropoffDateTime,
                          ReservationStatus = reservation.ReservationStatus,
                          ReservationTime = reservation.ReservationTime,
                          NumberOfDays = reservation.NumberOfDays,
                          PaidAmount = reservation.PaidAmount,
                          DailyRate = car.DailyRate,
                          CarID = car.CarId,
                          ImageUrl = car.ImageUrl,
                          CarMake = car.Make,
                          CarModel = car.Model,
                          PaymentId = reservation.PaymentId
                      })
                .ToListAsync();

            if (reservationsWithDetails == null || reservationsWithDetails.Count == 0)
            {
                return NotFound("No reservations found for the customer.");
            }

            return Ok(reservationsWithDetails);
        }



        [HttpGet("bookings")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<object>>> GetAllReservations()
        {
            // Retrieve reservations with details including car make, model, customer name, etc.
            var reservationsWithDetails = await _context.Reservations
                .Join(_context.CarListings,
                      reservation => reservation.CarId,
                      car => car.CarId,
                      (reservation, car) => new
                      {   
                          ReservationID = reservation.ReservationId,
                          CarId = car.CarId,
                          CarMake = car.Make,
                          CarModel = car.Model,
                          Image = car.ImageUrl,
                          DailyRate = car.DailyRate,
                          PaymentId = reservation.PaymentId,
                          ReservationTime = reservation.ReservationTime,
                          PaidAmount = reservation.PaidAmount,
                          NumberOfDays = reservation.NumberOfDays,
                          PickupDateTime = reservation.PickupDateTime,
                          DropoffDateTime = reservation.DropoffDateTime,
                          ReservationStatus = reservation.ReservationStatus,
                          CustomerID = reservation.CustomerId,

                      })
                .Join(_context.Customers,
                      reservation => reservation.CustomerID,
                      customer => customer.CustomerId,
                      (reservation, customer) => new
                      {

                          CustomerID = reservation.CustomerID,
                          ReservationID = reservation.ReservationID,
                          CarId = reservation.CarId,
                          PaymentId = reservation.PaymentId,
                          ReservationTime = reservation.ReservationTime,
                          PaidAmount=reservation.PaidAmount,
                          CarMake = reservation.CarMake,
                          CarModel = reservation.CarModel,
                          ImageUrl = reservation.Image,
                          DailyRate = reservation.DailyRate,
                          NumberOfDays = reservation.NumberOfDays,
                          PickupDateTime = reservation.PickupDateTime,
                          DropoffDateTime = reservation.DropoffDateTime,
                          ReservationStatus = reservation.ReservationStatus,
                          CustomerName = customer.FirstName + " " + customer.LastName,
                          CustomerEmail  = customer.EmailAddress,
                          CustomerPhoneNumber = customer.PhoneNumber,
                          CustomerAddress=customer.Address,
                      })
                .ToListAsync();

            if (reservationsWithDetails == null || reservationsWithDetails.Count == 0)
            {
                return NotFound("No reservations found.");
            }

            return Ok(reservationsWithDetails);
        }


        // PUT: api/Reservations/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Customer")]

        public async Task<IActionResult> PutReservation(int id, Reservation reservation)
        {

            if (id != reservation.ReservationId)
            {
                return BadRequest();
            }
            
            _context.Entry(reservation).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ReservationExists(id))
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

        // POST: api/Reservations
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        //[HttpPost]
        //[Authorize("Customer")]

        //public async Task<ActionResult<Reservation>> PostReservation(Reservation reservation)
        //{
        //    if (_context.Reservations == null)
        //    {
        //        return Problem("Entity set 'NewRoadReadyContext.Reservations'  is null.");
        //    }
        //    _context.Reservations.Add(reservation);
        //    await _context.SaveChangesAsync();

        //    return CreatedAtAction("GetReservation", new { id = reservation.ReservationId }, reservation);
        //}


        [HttpPost]
        [Authorize("Customer")]
        public async Task<ActionResult<Reservation>> PostReservation(Reservation reservation)
        {
            // Check if the selected pickup and drop-off dates overlap with existing reservations for the same car
            bool isOverlapping = _context.Reservations.Any(r =>
                r.CarId == reservation.CarId &&
                (reservation.PickupDateTime <= r.DropoffDateTime && reservation.DropoffDateTime >= r.PickupDateTime)
            );

            if (isOverlapping)
            {
                return BadRequest("The car is already booked by someone");
            }
            // Get the CustomerId associated with the provided LoginId
            var customerId = _context.Logins
                .Where(l => l.LoginId == reservation.CustomerId)
                .Select(l => l.CustomerId)
                .FirstOrDefault();

            if (customerId == default(int))
            {
                return BadRequest("Invalid LoginId or Customer not found.");
            }

            // Assign the retrieved CustomerId to the reservation
            reservation.CustomerId = customerId;

            if (_context.Reservations == null)
            {
                return Problem("Entity set 'NewRoadReadyContext.Reservations' is null.");
            }

            _context.Reservations.Add(reservation);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetReservation", new { id = reservation.ReservationId }, reservation);
        }

        // DELETE: api/Reservations/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,Customer")]

        public async Task<IActionResult> DeleteReservation(int id)
        {
            if (_context.Reservations == null)
            {
                return NotFound();
            }
            var reservation = await _context.Reservations.FindAsync(id);
            if (reservation == null)
            {
                return NotFound();
            }

            _context.Reservations.Remove(reservation);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ReservationExists(int id)
        {
            return (_context.Reservations?.Any(e => e.ReservationId == id)).GetValueOrDefault();
        }
    }
}
