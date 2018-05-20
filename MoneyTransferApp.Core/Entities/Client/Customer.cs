using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MoneyTransferApp.Core.Entities.Client
{
    [Table("Customer", Schema = "Client")]
    public class Customer
    {
        public int CustomerId { get; set; }

        [StringLength(10)]
        [Column(TypeName = "varchar(10)")]
        public string CustomerCode { get; set; }
        
        [StringLength(256)]
        [Column(TypeName = "varchar(256)")]
        public string FullName { get; set; }

        [StringLength(128)]
        [Column(TypeName = "varchar(128)")]
        public string Email { get; set; }

        [StringLength(512)]
        [Column(TypeName = "varchar(512)")]
        public string Address { get; set; }

        [StringLength(50)]
        [Column(TypeName = "varchar(50)")]
        public string Phone { get; set; }

        public int? CustomerType { get; set; }

        public DateTimeOffset? CreatedOn { get; set; }

        public Guid? CreatedBy { get; set; }

        public DateTimeOffset? UpdatedOn { get; set; }

        public Guid? UpdatedBy { get; set; }

        public DateTimeOffset? DeletedOn { get; set; }

        public Guid? DeletedBy { get; set; }

    }
}
