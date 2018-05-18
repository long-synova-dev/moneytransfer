using System;
using System.ComponentModel.DataAnnotations;

namespace MoneyTransferApp.Web.Models.AuthViewModels
{
    public class RefreshTokenViewModel
    {
        [Required]
        public Guid RefreshToken { get; set; }
    }
}
