using MoneyTransferApp.Core.Entities.Users;
using MoneyTransferApp.Web.Models.BaseViewModels;
using MoneyTransferApp.Web.Models.PagingViewModels;
using MoneyTransferApp.Web.Models.UserViewModels;
using System;
using System.Threading.Tasks;

namespace MoneyTransferApp.Web.Interfaces
{
    public interface IUserService
    {
        bool IsUsernameAvailable(string username);
        User GetUserByPhone_UserName(string input);
        User GetUserById(Guid id);
        PagingOutputViewModel<UserBasicInfoViewModel> GetAll(PagingInputViewModel param);
        Task<string> CreateUser(RegisterViewModel model, UserIdentityViewModel CurrentUserIdentity);
        void UpdateLastLogin(Guid userId);
        void AddUserToRole(Guid userId, string roleName);
        void DeleteUser(Guid id, UserIdentityViewModel CurrentUserIdentity);
        void ChangeLanguage(Guid userId, int languageId);
    }
}
