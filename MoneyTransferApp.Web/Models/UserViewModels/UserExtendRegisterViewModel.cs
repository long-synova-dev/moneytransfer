using System;
using System.ComponentModel.DataAnnotations;

namespace MoneyTransferApp.Web.Models.UserViewModels
{
    public class UserExtendRegisterViewModel
    {
        public Guid? Id { get; set; }
        public string RoleId { get; set; }
        public bool IsActive { get; set; }
        public bool IsAOA { get; set; }
        public bool IsNew { get; set; }
        [Required]
        [StringLength(128)]
        public string FirstName { get; set; }

        [Required]
        [StringLength(128)]
        public string LastName { get; set; }

        //[StringLength(20)]
        public string PhoneNumber { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}
