using System.ComponentModel.DataAnnotations;

namespace MoneyTransferApp.Web.Models.UserViewModels
{
    public class ChangeLanguageViewModel
    {
        [Required]
        public int LanguageId { get; set; }
    }
}
