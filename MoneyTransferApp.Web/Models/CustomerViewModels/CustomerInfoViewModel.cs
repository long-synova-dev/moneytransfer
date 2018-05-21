using System.ComponentModel.DataAnnotations;

namespace MoneyTransferApp.Web.Models.CustomerViewModels
{
    public class CustomerInfoViewModel
    {
        public int CustomerId { get; set; }

        [StringLength(10)]
        public string CustomerCode { get; set; }

        [StringLength(256)]
        public string FullName { get; set; }

        [StringLength(128)]
        public string Email { get; set; }

        [StringLength(512)]
        public string Address { get; set; }

        [StringLength(50)]
        public string Phone { get; set; }
    }
}
