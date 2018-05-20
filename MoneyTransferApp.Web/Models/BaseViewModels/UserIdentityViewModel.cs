using System;
using System.Xml.Linq;

namespace MoneyTransferApp.Web.Models.BaseViewModels
{
    public class UserIdentityViewModel
    {
        public Guid UserId { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string[] Roles { get; set; }
        public string Locale { get; set; }
    }
}
