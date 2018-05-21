using System.ComponentModel.DataAnnotations;

namespace MoneyTransferApp.Web.Models.CustomerViewModels
{
    public class ReceiverInfoViewModel
    {
        public int ReceiverId { get; set; }

        public int CustomerId { get; set; }

        [StringLength(256)]
        public string ReceiverName { get; set; }

        [StringLength(100)]
        public string ReceiverIdentityCard { get; set; }

        public string IDIssueDate { get; set; }

        [StringLength(50)]
        public string ReceiverPhone1 { get; set; }

        [StringLength(50)]
        public string ReceiverPhone2 { get; set; }

        public string BankName { get; set; }

        [StringLength(50)]
        public string BankAccount { get; set; }

        [StringLength(256)]
        public string BranchName { get; set; }

        [StringLength(128)]
        public string Province { get; set; }

        [StringLength(128)]
        public string District { get; set; }
    }
}
