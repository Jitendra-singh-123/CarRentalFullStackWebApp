using System;
using System.Collections.Generic;

namespace CarRentalBackend.Models
{
    public partial class Reservation
    {
        public int ReservationId { get; set; }
        public int? CustomerId { get; set; }
        public int? CarId { get; set; }
        public int? PaymentId { get; set; }
        public DateTime? PickupDateTime { get; set; }
        public DateTime? DropoffDateTime { get; set; }
        public string? ReservationStatus { get; set; }
        public decimal? PaidAmount { get; set; }
        public DateTime? ReservationTime { get; set; }
        public int? NumberOfDays { get; set; }

        public virtual CarListing? Car { get; set; }
        public virtual Customer? Customer { get; set; }
        public virtual PaymentDetail? Payment { get; set; }
    }
}
