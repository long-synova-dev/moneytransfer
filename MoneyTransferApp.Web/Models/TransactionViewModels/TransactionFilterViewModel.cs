using System;

namespace MoneyTransferApp.Web.Models.TransactionViewModels
{
    public class TransactionFilterViewModel
    {
        public string TransactionNo { get; set; }

        public string CustomerNo { get; set; }

        public string CustomerPhone { get; set; }

        public DateTimeOffset? CreateDateStart { get; set; }

        public DateTimeOffset? CreateDateEnd { get; set; }
    }
}
