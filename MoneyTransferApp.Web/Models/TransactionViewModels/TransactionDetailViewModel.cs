using System;

namespace MoneyTransferApp.Web.Models.TransactionViewModels
{
    public class TransactionDetailViewModel
    {
        public int TransactionId { get; set; }

        // Customer information
        public int CustomerId { get; set; }
        public string CustomerName { get; set; }
        public string CustomerPhone { get; set; }

        // Receiver Information
        public int ReceiverId { get; set; }
        public string ReceiverName { get; set; }
        public string IDNumber { get; set; }
        public string IDIssueDate { get; set; }
        public string ReceiverPhone { get; set; }

        // Receiver Bank Information
        public string ReceiverAccountNumber { get; set; }
        public string BankName { get; set; }
        public string BranchName { get; set; }
        public string Province { get; set; }
        public string District { get; set; }

        // Sender information (in VietNam)
        public string SenderName { get; set; }
        public string SenderPhone { get; set; }

        // Transaction Information
        public int CurrencyId { get; set; }
        public int? Status { get; set; }
        public string TransactionNo { get; set; }
        public double Amount { get; set; }

        public string StoreName { get; set; }

        public DateTimeOffset CreatedOn { get; set; }
    }
}
