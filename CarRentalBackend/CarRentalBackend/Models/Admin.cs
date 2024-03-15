using System;
using System.Collections.Generic;

namespace CarRentalBackend.Models
{
    public partial class Admin
    {
        public Admin()
        {
            Logins = new HashSet<Login>();
        }

        public int AdminId { get; set; }
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string RePassword { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string? Address { get; set; }
        public string Role { get; set; } = null!;
        public string? Gender { get; set; }

        public virtual ICollection<Login> Logins { get; set; }
    }
}
