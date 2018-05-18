using System;
using Microsoft.AspNetCore.Identity;

namespace MoneyTransferApp.Core.Entities.Users
{
    public class UserRole : IdentityUserRole<Guid>
    {
        public virtual User User { get; set; }

        public virtual Role Role { get; set; }
    }
}
