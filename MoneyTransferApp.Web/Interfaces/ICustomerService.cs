using MoneyTransferApp.Web.Models.BaseViewModels;
using MoneyTransferApp.Web.Models.CommonViewModels;
using MoneyTransferApp.Web.Models.CustomerViewModels;
using MoneyTransferApp.Web.Models.PagingViewModels;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MoneyTransferApp.Web.Interfaces
{
    public interface ICustomerService
    {
        PagingOutputViewModel<CustomerInfoViewModel> GetAllCustomer(PagingInputViewModel param);
        Task<string> SaveCustomer(UserIdentityViewModel user, CustomerInfoViewModel model);
        Task<string> DeleteCustomer(UserIdentityViewModel user, int id);

        // Service for Receiver
        ICollection<OptionViewModel> GetReceiversByCustomer(int customerId);
        ReceiverInfoViewModel GetReceiverInfoById(int id);
        Task<string> SaveReceiver(UserIdentityViewModel user, ReceiverInfoViewModel model);
        Task<string> DeleteReceiver(UserIdentityViewModel user, int id);
    }
}
