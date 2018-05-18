using System.ComponentModel.DataAnnotations;

namespace MoneyTransferApp.Web.Models.UserViewModels
{
    public class UserIdViewModel
    {
        [Required]
        public string UserId { get; set; }
    }
}
