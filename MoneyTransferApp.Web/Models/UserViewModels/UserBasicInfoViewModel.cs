using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace MoneyTransferApp.Web.Models.UserViewModels
{
    public class UserBasicInfoViewModel
    {
        public Guid UserId { get; set; }

        [StringLength(50)]
        public string Title { get; set; }

        [StringLength(128)]
        public string FirstName { get; set; }

        [StringLength(128)]
        public string LastName { get; set; }

        public string FullName => $"{FirstName} {LastName}";
        
        public string Email { get; set; }

        [StringLength(50)]
        public string Phone { get; set; }

        public Guid? CompanyId { get; set; }

        public string CompanyName { get; set; }

        public string CompanyNumber { get; set; }

        public IEnumerable<string> Roles { get; set; }

        public bool IsActive { get; set; }

        public DateTimeOffset? LockedOutEnd { get; set; }
    }
}
