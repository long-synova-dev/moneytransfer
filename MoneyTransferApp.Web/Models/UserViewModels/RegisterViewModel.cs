using System.ComponentModel.DataAnnotations;

namespace MoneyTransferApp.Web.Models.UserViewModels
{
    public class RegisterViewModel
    {
        [Required]
        [StringLength(128)]
        public string FirstName { get; set; }

        [Required]
        [StringLength(128)]
        public string LastName { get; set; }

        [Required]
        [StringLength(300)]
        public string StoreName { get; set; }

        [Required]
        public string UserName { get; set; }

        [StringLength(20)]
        public string PhoneNumber { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }
        
        public int? LanguageId { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "The {0} must be at least {2} and at max {1} characters long.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; }
    }
}
