using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace MoneyTransferApp.Core.Entities.Users
{
    public class Role : IdentityRole<Guid>
    {
        public bool IsDeleted { get; set; }

        public virtual ICollection<UserRole> UserRoles { get; set; }
    }
}
