using System.ComponentModel.DataAnnotations;

namespace MoneyTransferApp.Web.Models.CommonViewModels
{
    public class OrderUpdateViewModel
    {
        [Required]
        public int RowId { get; set; }

        public float Order { get; set; }
    }
}
