using System;
using System.Collections.Generic;

namespace CarRentalBackend.Models
{
    public partial class Login
    {
        public int LoginId { get; set; }
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string Role { get; set; } = null!;
        public int? CustomerId { get; set; }
        public int? AdminId { get; set; }

        public virtual Admin? Admin { get; set; }
        public virtual Customer? Customer { get; set; }
    }
}
