using System;
using System.Collections.Generic;
using MoneyTransferApp.Core.Entities.Users;
using MoneyTransferApp.Web.Models.PagingViewModels;
using MoneyTransferApp.Web.Models.UserViewModels;
using System.Threading.Tasks;
using MoneyTransferApp.Core.Entities.Client;
using MoneyTransferApp.Web.Models.BaseViewModels;
using MoneyTransferApp.Web.Models.CommonViewModels;

namespace MoneyTransferApp.Web.Interfaces
{
    public interface IUserService
    {
        User GetUserByEmail(string email);

        User GetUserByToken(Guid token);

        bool IsUsernameAvailable(string username);

        Company VerifyCompanyNumber(string email, string companyNumber);

        void ChangeLanguage(Guid userId, int languageId);

        PagingOutputViewModel<UserBasicInfoViewModel> GetAll(PagingInputViewModel param);
        PagingOutputViewModel<UserExtendInfoViewModel> GetUserFromLogin(Guid companyID);
        void UpdateLastLogin(Guid userId);
        Task<string> CreateUser(UserExtendRegisterViewModel model, UserIdentityViewModel CurrentUserIdentity);
        Task<string> SaveUser(UserExtendRegisterViewModel model, UserIdentityViewModel CurrentUserIdentity);
        void DeleteUser(Guid id, UserIdentityViewModel CurrentUserIdentity);

        ICollection<OptionViewModel> GetUsersInCompany(Guid? companyId);
        List<RoleViewModel> GetRoles();
        List<RoleViewModel> GetRolesWithOriginalName();
        UserExtendRegisterViewModel GetUSerById(Guid id, UserIdentityViewModel user);

        ICollection<OptionViewModel> GetCategoryByCode(string code);
        Task<bool> ResendEmail(UserExtendInfoViewModel model);
        Task<CheckUserViewModel> GetUserStatus(Guid id, int langId);
        Task<string> UpdateUser(UserExtendRegisterViewModel model, UserIdentityViewModel CurrentUserIdentity);
        int? GetMaximumUsers(UserIdentityViewModel model);
        User GetUserByEmail(string email, string companyNumber);
        List<User> GetUserListByEmail(string email);
        void AddUserToRole(Guid userId, string roleName);
        string ChangeRole(Guid userId, UserIdentityViewModel currentUser);
        List<User> GetAccountOnwerUserList();
        string UpdateUserInfo(UserBasicInfoViewModel model, UserIdentityViewModel user);
        User GetCurentUser(Guid userId);
    }
}
