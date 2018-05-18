using System;

namespace MoneyTransferApp.Web.Models.CommonViewModels
{
    public class ChangeLogViewModel
    {
        public string Message { get; set; }

        public DateTimeOffset? Date { get; set; }
    }
}
