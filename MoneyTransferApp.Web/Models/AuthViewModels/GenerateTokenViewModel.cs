using System.ComponentModel.DataAnnotations;

namespace MoneyTransferApp.Web.Models.AuthViewModels
{
    public class GenerateTokenViewModel
    {
        public string CompanyNumber { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }
    }
}
