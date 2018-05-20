using MoneyTransferApp.Core.Entities.Client;
using System.ComponentModel.DataAnnotations;

namespace MoneyTransferApp.Web.Models.PagingViewModels
{
    public class PagingInputViewModel
    {
        [Required]
        [Range(1, int.MaxValue)]
        public int PageNumber { get; set; }

        [Required]
        [Range(1, 1000)]
        public int ItemsPerPage { get; set; }

        public string Keyword { get; set; }

        public string OrderBy { get; set; }

        public bool? IsDesc { get; set; }
    }
}
