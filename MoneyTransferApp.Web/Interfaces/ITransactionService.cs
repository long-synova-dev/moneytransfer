using MoneyTransferApp.Web.Models.BaseViewModels;
using MoneyTransferApp.Web.Models.PagingViewModels;
using MoneyTransferApp.Web.Models.TransactionViewModels;
using System.Threading.Tasks;

namespace MoneyTransferApp.Web.Interfaces
{
    public interface ITransactionService
    {
        PagingOutputViewModel<TransactionListViewModel> SearchTransaction(TransactionFilterViewModel filter);
        TransactionDetailViewModel GetTransactionDetail(UserIdentityViewModel user, int customerId);
        Task<string> SaveTransaction(UserIdentityViewModel user, TransactionDetailViewModel model);
    }
}
