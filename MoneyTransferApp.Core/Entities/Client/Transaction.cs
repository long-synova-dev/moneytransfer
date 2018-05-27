using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MoneyTransferApp.Core.Entities.Client
{
    [Table("Transaction", Schema = "Client")]
    public class Transaction
    {
        public int TransactionId { get; set; }
        
        public int ReceiverId { get; set; }

        public int CurrencyId { get; set; }

        public int? Status { get; set; }
        
        [StringLength(50)]
        [Column(TypeName = "varchar(50)")]
        public string TransactionNo { get; set; }
        
        public double Amount { get; set; }

        [ForeignKey("ReceiverId")]
        public virtual Receiver Receiver { get; set; }

        public DateTimeOffset? CreatedOn { get; set; }

        public Guid? CreatedBy { get; set; }

        public DateTimeOffset? UpdatedOn { get; set; }

        public Guid? UpdatedBy { get; set; }

        public DateTimeOffset? DeletedOn { get; set; }

        public Guid? DeletedBy { get; set; }
    }

    public enum Currency
    {
        VND = 1,
        TWD = 2
    }

    public enum Status
    {
        New = 1,
        Transfered = 2,
        Completed = 3
    }
}
