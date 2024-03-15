using System;
using System.Collections.Generic;

namespace CarRentalBackend.Models
{
    public partial class PaymentDetail
    {
        public PaymentDetail()
        {
            Reservations = new HashSet<Reservation>();
        }

        public int PaymentId { get; set; }
        public int? CustomerId { get; set; }
        public int? CarId { get; set; }
        public string PaymentMethod { get; set; } = null!;
        public string? AccountDetails { get; set; }
        public decimal? Amount { get; set; }
        public string? TransactionStatus { get; set; }
        public DateTime? TransactionDate { get; set; }

        public virtual CarListing? Car { get; set; }
        public virtual Customer? Customer { get; set; }
        public virtual ICollection<Reservation> Reservations { get; set; }
    }
}
