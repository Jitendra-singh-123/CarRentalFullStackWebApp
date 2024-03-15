using System;
using System.Collections.Generic;

namespace CarRentalBackend.Models
{
    public partial class Feedback
    {
        public int FeedbackId { get; set; }
        public int? CustomerId { get; set; }
        public int? CarId { get; set; }
        public decimal? Rating { get; set; }
        public string? Review { get; set; }
        public DateTime? ReviewDateTime { get; set; }

        public virtual CarListing? Car { get; set; }
        public virtual Customer? Customer { get; set; }
    }
}
