using System.ComponentModel.DataAnnotations;

namespace MoneyTransferApp.Web.Models.UserViewModels
{
    public class ConfirmEmailViewModel
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        
        public string Code { get; set; }

        public string CompanyNumber { get; set; }
    }
}
