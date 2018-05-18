using System.ComponentModel.DataAnnotations;

namespace MoneyTransferApp.Web.Models.CommonViewModels
{
    public class ListSelectViewModel
    {
        [Required]
        public string Id { get; set; }

        public string FilterId { get; set; }

        public string Name { get; set; }

        public bool Selected { get; set; }
    }
}
