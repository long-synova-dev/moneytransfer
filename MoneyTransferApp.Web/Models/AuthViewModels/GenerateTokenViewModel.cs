using System.ComponentModel.DataAnnotations;

namespace MoneyTransferApp.Web.Models.AuthViewModels
{
    public class GenerateTokenViewModel
    {
        [Required]
        public string UserName { get; set; }

        [Required]
        public string Password { get; set; }
    }
}
