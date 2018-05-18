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
        public string Plan { get; set; }
        public int Language { get; set; }
        public string Locale { get; set; }
        public Guid? CompanyId { get; set; }
        public string CompanyNumber { get; set; }
        public XDocument GdprXmlData { get; set; }
    }
}
