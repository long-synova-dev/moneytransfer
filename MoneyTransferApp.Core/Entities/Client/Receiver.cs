using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MoneyTransferApp.Core.Entities.Client
{
    [Table("Receiver", Schema = "Client")]
    public class Receiver
    {
        public int ReceiverId { get; set; }

        public int CustomerId { get; set; }

        [StringLength(256)]
        [Column(TypeName = "varchar(256)")]
        public string ReceiverName { get; set; }

        [StringLength(100)]
        [Column(TypeName = "varchar(100)")]
        public string ReceiverIdentityCard { get; set; }

        public string IDIssueDate { get; set; }

        [StringLength(50)]
        [Column(TypeName = "varchar(50)")]
        public string ReceiverPhone1 { get; set; }

        [StringLength(50)]
        [Column(TypeName = "varchar(50)")]
        public string ReceiverPhone2 { get; set; }

        public string BankName { get; set; }

        [StringLength(50)]
        [Column(TypeName = "varchar(50)")]
        public string BankAccount { get; set; }

        [StringLength(256)]
        [Column(TypeName = "varchar(256)")]
        public string BranchName { get; set; }

        [StringLength(128)]
        [Column(TypeName = "varchar(128)")]
        public string Province { get; set; }

        [StringLength(128)]
        [Column(TypeName = "varchar(128)")]
        public string District { get; set; }

        [ForeignKey("CustomerId")]
        public virtual Customer Customer { get; set; }

        public DateTimeOffset? CreatedOn { get; set; }

        public Guid? CreatedBy { get; set; }

        public DateTimeOffset? UpdatedOn { get; set; }

        public Guid? UpdatedBy { get; set; }

        public DateTimeOffset? DeletedOn { get; set; }

        public Guid? DeletedBy { get; set; }
    }
}
