using System;

namespace MoneyTransferApp.Web.Models.UserViewModels
{
    public class UserExtendInfoViewModel : UserBasicInfoViewModel
    {
        public DateTimeOffset? CreateOn { get; set; }
        public DateTimeOffset? LastLogin { get; set; }
        public string RoleName { get; set; }
        public bool Active { get; set; }
        public bool EmailConfirmed { get; set; }
        public int? LanguageId { get; set; }
    }
}
