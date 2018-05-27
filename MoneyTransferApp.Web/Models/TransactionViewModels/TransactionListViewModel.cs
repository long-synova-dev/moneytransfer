using System;

namespace MoneyTransferApp.Web.Models.TransactionViewModels
{
    public class TransactionListViewModel
    {
        public int TransactionId { get; set; }
        public string TransactionNo { get; set; }
        public string CustomerCode { get; set; }
        public string CustomerName { get; set; }

        public string ReceiverName { get; set; }
        public string CurrencyName { get; set; }
        public double Amount { get; set; } 
        public DateTimeOffset? CreatedOn { get; set; }
    }
}
