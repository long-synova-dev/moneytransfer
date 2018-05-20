using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace MoneyTransferApp.Core.Entities.Users
{
    public class User : IdentityUser<Guid>
    {
        [StringLength(256)]
        public string StoreName { get; set; }

        [StringLength(128)]
        public string FirstName { get; set; }

        [StringLength(128)]
        public string LastName { get; set; }

        [StringLength(512)]
        [Column(TypeName = "varchar(512)")]
        public string Address { get; set; }
        
        public virtual ICollection<UserRole> UserRoles { get; set; }

        public DateTimeOffset? CreatedOn { get; set; }

        public Guid? CreatedBy { get; set; }

        public DateTimeOffset? UpdatedOn { get; set; }

        public Guid? UpdatedBy { get; set; }

        public DateTimeOffset? DeletedOn { get; set; }

        public Guid? DeletedBy { get; set; }
        
        public DateTimeOffset? LastLogin { get; set; }
    }
}
