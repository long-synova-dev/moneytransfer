using System;
using System.Xml.Linq;

namespace MoneyTransferApp.Web.Models.UserViewModels
{
    public class XmlDataViewModel
    {
        public XDocument XDocument { get; set; }

        public int LanguageId { get; set; }

        public DateTimeOffset UpdatedTime { get; set; }
    }
}
