using System;
using System.Collections.Generic;

namespace MoneyTransferApp.Web.Models.PagingViewModels
{
    public class PagingOutputViewModel<T>
    {
        public int TotalItems { get; set; }

        public int ItemsPerPage { get; set; }

        public int NumberOfPages => (int)Math.Ceiling((double)TotalItems / ItemsPerPage);

        public IEnumerable<T> Data { get; set; }
    }
}
