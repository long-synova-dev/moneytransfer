using System;
using System.Collections.Generic;
using System.Linq;
using MoneyTransferApp.Core.Entities.Users;
using MoneyTransferApp.Core.Interfaces;
using MoneyTransferApp.Web.Extensions;
using MoneyTransferApp.Web.Interfaces;
using MoneyTransferApp.Web.Models.PagingViewModels;
using MoneyTransferApp.Web.Models.UserViewModels;
using Microsoft.EntityFrameworkCore;
using MoneyTransferApp.Web.Models.BaseViewModels;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using System.Text;
using MoneyTransferApp.Core.Entities.Client;
using MoneyTransferApp.Infrastructure.Common;
using MoneyTransferApp.Web.Common;
using MoneyTransferApp.Web.Models.CommonViewModels;

namespace MoneyTransferApp.Web.Services
{
    public class UserService : IUserService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IEmailServices _emailServices;
        private readonly UserManager<User> _userManager;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UserService(IUnitOfWork unitOfWork, UserManager<User> userManager, IEmailServices emailServices, IHttpContextAccessor httpContextAccessor)
        {
            _unitOfWork = unitOfWork;
            _userManager = userManager;
            _emailServices = emailServices;
            _httpContextAccessor = httpContextAccessor;
        }

        public User GetUserByEmail(string email)
        {
            var user = _unitOfWork.UserRepository.All()
                .Where(u => u.Email == email)
                .Include(u => u.Language)
                .FirstOrDefault();

            return user;
        }
        public User GetUserByEmail(string email, string companyNumber)
        {
            User user = null;
            var company = _unitOfWork.CompanyRepository.All().FirstOrDefault(s => s.DeletedBy == null && s.CompanyNumber == companyNumber);
            if (company != null)
            {
                user = _unitOfWork.UserRepository.All().Where(s => s.DeletedBy == null && s.Email.Equals(email, StringComparison.OrdinalIgnoreCase) && s.CompanyId == company.CompanyId)
                .Include(s => s.Language)
                .FirstOrDefault();
            }
            return user;
        }

        public User GetUserByToken(Guid token)
        {
            var user = _unitOfWork.UserRepository.All()
                .Where(u => u.SecurityStamp == token.ToString() || u.Id == token)
                .Include(u => u.Language)
                .FirstOrDefault();

            return user;
        }


        public Company VerifyCompanyNumber(string email, string companyNumber)
        {
            var company = from com in _unitOfWork.CompanyRepository.FindBy(s => s.CompanyNumber.Equals(companyNumber))
                          join user in _unitOfWork.UserRepository.FindBy(s => s.Email.Equals(email))
                          on com.CompanyId equals user.CompanyId
                          select com;


            return company.FirstOrDefault();
        }

        public bool IsUsernameAvailable(string username)
        {
            return _unitOfWork.UserRepository.All().Any(user => user.UserName.Equals(username));
        }

        public void ChangeLanguage(Guid userId, int languageId)
        {
            var user = _unitOfWork.UserRepository.All().FirstOrDefault(u => u.Id == userId);

            if (user == null)
            {
                throw new NullReferenceException("User not found");
            }

            user.LanguageId = languageId;
            _unitOfWork.UserRepository.Update(user);
            _unitOfWork.SaveChange();
        }

        public PagingOutputViewModel<UserBasicInfoViewModel> GetAll(PagingInputViewModel param)
        {
            var output = new PagingOutputViewModel<UserBasicInfoViewModel>
            {
                ItemsPerPage = param.ItemsPerPage
            };

            var repository = _unitOfWork.UserRepository.All();
            if (!string.IsNullOrEmpty(param.Keyword))
            {
                repository = repository
                    .Where(user => user.FirstName.Contains(param.Keyword)
                                    || user.LastName.Contains(param.Keyword)
                                   || user.Email.Contains(param.Keyword)
                                   || user.PhoneNumber.Contains(param.Keyword)
                                   || user.UserRoles.Any(role => role.Role.Name.Contains(param.Keyword))
                                   || user.Company.CompanyName.Contains(param.Keyword)
                                   || user.Company.CompanyNumber.Contains(param.Keyword));
            }

            var data = repository.Select(user => new UserBasicInfoViewModel
            {
                UserId = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Phone = user.PhoneNumber,
                CompanyId = user.CompanyId,
                CompanyName = user.Company.CompanyName,
                CompanyNumber = user.Company.CompanyNumber,
                Roles = user.UserRoles.Select(ur => ur.Role.Name).ToList(),
                IsActive = user.LockoutEnd == null || user.LockoutEnd < DateTimeOffset.Now,
                LockedOutEnd = user.LockoutEnd < DateTimeOffset.Now ? null : user.LockoutEnd
            });

            if (!string.IsNullOrEmpty(param.OrderBy))
            {
                data = data.OrderByProperty(param.OrderBy, param.IsDesc);
            }

            data = data.Skip((param.PageNumber - 1) * param.ItemsPerPage).Take(param.ItemsPerPage);

            // Enumerate the data
            output.TotalItems = repository.Count();
            output.Data = data.ToList();

            return output;
        }
        public PagingOutputViewModel<UserExtendInfoViewModel> GetUserFromLogin(Guid companyID)
        {
            var output = new PagingOutputViewModel<UserExtendInfoViewModel>();
            var data = _unitOfWork.UserRepository.All().Where(s => s.DeletedBy == null && s.CompanyId == companyID).Select(
                user =>
                     new
                     {

                         UserId = user.Id,
                         FirstName = user.FirstName,
                         LastName = user.LastName,
                         Phone = user.PhoneNumber,
                         Email = user.Email,
                         IsActive = (user.LockoutEnd == null || user.LockoutEnd < DateTimeOffset.UtcNow),
                         Roles = user.UserRoles.Select(s => s.Role.Id.ToString()).ToList(),
                         CreateOn = user.CreatedOn,
                         LastLogin = user.LastLogin,
                         RoleName = string.Empty,
                         EmailConfirmed = user.EmailConfirmed
                     }
                ).ToList();
            var roles = GetRoles();

            var result = data.Select(user =>
            {
                var roleId = string.Join(",", user.Roles).ToLower();
                var roleName = string.Empty;
                var role = roles.FirstOrDefault(s => s.value == roleId);
                if (role != null) roleName = role.label;

                return new UserExtendInfoViewModel
                {
                    UserId = user.UserId,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Active = user.IsActive,
                    Roles = user.Roles,
                    CreateOn = user.CreateOn,
                    LastLogin = user.LastLogin,
                    RoleName = roleName,
                    EmailConfirmed = user.EmailConfirmed,
                    Phone = user.Phone,
                    Email = user.Email
                };
            }).OrderByDescending(s => s.Active).ToList();

            output.Data = result;
            return output;
        }
        public void UpdateLastLogin(Guid userId)
        {
            var user = _unitOfWork.UserRepository.All().FirstOrDefault(s => s.Id == userId);
            if (user != null)
            {
                user.LastLogin = DateTimeOffset.UtcNow;
                _unitOfWork.UserRepository.Update(user);
                _unitOfWork.SaveChange();
            }

        }
        public async Task<string> SaveUser(UserExtendRegisterViewModel model, UserIdentityViewModel CurrentUserIdentity)
        {
            try
            {
                if (model.Id == null)
                {
                    return await CreateUser(model, CurrentUserIdentity);
                }
                return await UpdateUser(model, CurrentUserIdentity);
            }
            catch (Exception ex)
            {
                return "User.SaveError";
            }
        }

        public async Task<string> CreateUser(UserExtendRegisterViewModel model, UserIdentityViewModel CurrentUserIdentity)
        {
            return "User.SaveSuccess";
        }

        public async Task<bool> ResendEmail(UserExtendInfoViewModel model)
        {
            return true;
        }

        public async Task<string> UpdateUser(UserExtendRegisterViewModel model, UserIdentityViewModel CurrentUserIdentity)
        {
            return "User.SaveError";

        }

        public void DeleteUser(Guid id, UserIdentityViewModel CurrentUserIdentity)
        {
            var tasks = _unitOfWork.GdprTaskRepository.All().Where(s => s.TaskPerformerId == id || s.TaskReviewerId == id);
            if (tasks != null && tasks.Any())
            {
                foreach (var task in tasks)
                {
                    task.TaskPerformerId = task.TaskResponsibleId;
                    task.TaskReviewerId = task.TaskResponsibleId;
                    _unitOfWork.GdprTaskRepository.Update(task);
                }
            }
            var user = _unitOfWork.UserRepository.All().FirstOrDefault(s => s.Id == id);
            user.DeletedBy = CurrentUserIdentity.UserId;
            user.DeletedOn = DateTimeOffset.UtcNow;
            _unitOfWork.UserRepository.Update(user);
            _unitOfWork.SaveChange();
        }

        public ICollection<OptionViewModel> GetUsersInCompany(Guid? companyId)
        {
            var usersInCompany = _unitOfWork.UserRepository.All().Where(u =>
                    u.DeletedOn == null && (u.LockoutEnd == null || u.LockoutEnd < DateTimeOffset.Now) &&
                    u.CompanyId == companyId)
                .Select(u => new OptionViewModel
                {
                    Value = u.Id.ToString(),
                    Label = u.FirstName + ' ' + u.LastName
                })
                .ToList();

            return usersInCompany;
        }

        public List<RoleViewModel> GetRoles()
        {
            var listRoles = new List<RoleViewModel>();
            var roles = _unitOfWork.RoleRepository.All().Where(s => !s.IsDeleted && s.Name != "R0" && s.Name != "R1").Select(s => new { value = s.Id, label = s.Name });
            //var accountandadmin = string.Join(",", roles.Where(s => s.label == "r2" || s.label == "r3").Select(s => s.value));
            //listRoles.Add(new RoleViewModel
            //{
            //    value = accountandadmin,
            //    label = "Account Owner & Administrator"
            //});
            var accountowner = roles.FirstOrDefault(s => s.label == "R2")?.value.ToString();
            listRoles.Add(new RoleViewModel
            {
                value = accountowner,
                label = "AccountOwner"
            });

            var adminid = roles.FirstOrDefault(s => s.label == "R3")?.value.ToString();
            listRoles.Add(new RoleViewModel
            {
                value = adminid,
                label = "Administrator"
            });
            var performreviewid = roles.FirstOrDefault(s => s.label == "R4")?.value.ToString();
            listRoles.Add(new RoleViewModel
            {
                value = performreviewid,
                label = "PerformerReviewer"
            });
            return listRoles;
        }

        public List<RoleViewModel> GetRolesWithOriginalName()
        {
            return _unitOfWork.RoleRepository.All().Where(s => !s.IsDeleted && s.Name != "R0" && s.Name != "R1")
                .Select(s => new RoleViewModel
                {
                    value = s.Id.ToString(), label = s.Name
                }).ToList();
        }

        public UserExtendRegisterViewModel GetUSerById(Guid id, UserIdentityViewModel curUser)
        {
            if (id.Equals(Guid.Empty))
            {
                return new UserExtendRegisterViewModel
                {
                    IsNew = true,
                    LanguageId = curUser.Language,
                    IsActive = true
                };
            }
            else
            {
                var user = _unitOfWork.UserRepository.All().Where(s => s.DeletedBy == null && s.Id == id).Select(item => new
                UserExtendRegisterViewModel
                {
                    Id = item.Id,
                    LastName = item.LastName,
                    FirstName = item.FirstName,
                    Email = item.Email,
                    IsActive = item.LockoutEnd == null || item.LockoutEnd < DateTimeOffset.UtcNow,
                    PhoneNumber = item.PhoneNumber,
                    LanguageId = item.LanguageId,
                    RoleId = string.Join(",", item.UserRoles.Select(s => s.Role.Id.ToString())),
                    IsNew = false,
                    //Translations = _unitOfWork.LanguageRepository.All().Select(s => new TranslationViewModel
                    //{
                    //    LanguageId = s.LanguageId,
                    //    LanguageCode = s.LanguageCode,
                    //    LanguageName = s.LanguageName,
                    //}).ToList()
                }).FirstOrDefault();

                if (AOARole() == user.RoleId) user.IsAOA = true;
                return user;
            }

        }

        public User GetCurentUser(Guid userId)
        {
            return _unitOfWork.UserRepository.All().FirstOrDefault(s => s.DeletedBy == null && s.Id == userId);
        }

        public int? GetMaximumUsers(UserIdentityViewModel model)
        {
            var currentSubscription = _unitOfWork.CompanySubscriptionRepository.All()
                .Where(s => s.CompanyId == model.CompanyId && s.DeletedOn == null).Select(s => s.BillingPlanId).FirstOrDefault();

            if (!string.IsNullOrEmpty(currentSubscription))
            {
                var maxUsers = _unitOfWork.BillingPlanRepository.All()
                    .Where(b => b.ReepayPlanId == currentSubscription)
                    .Select(b => b.MaximumUsers ?? 0).FirstOrDefault();

                var currentAddOns = _unitOfWork.CompanyAddOnRepository.All().Where(ca => ca.CompanyId == model.CompanyId && ca.DeletedOn == null).Select(ca => ca.AddOnId).ToList();
                var additionalUsers = _unitOfWork.AddOnRepository
                    .All().FirstOrDefault(ao => currentAddOns.Contains(ao.ReepayAddOnId) && ao.AddOnType == "user")
                    ?.MaximumCapcity;

                maxUsers += additionalUsers ?? 0;

                return maxUsers;
            }

            return null;
        }
        /// <summary>
        /// Get Account Owner & Administrator Roles Ids
        /// </summary>
        /// <returns></returns>
        internal string AOARole()
        {
            var roles = _unitOfWork.RoleRepository.All().Where(s => s.Name != "R0" && s.Name != "R1").Select(s => new { value = s.Id, label = s.Name });
            return string.Join(",", roles.Where(s => s.label == "R2" || s.label == "R3").Select(s => s.value));
        }

        public ICollection<OptionViewModel> GetCategoryByCode(string code)
        {
            //Get master tags
            var masterTags = _unitOfWork.TagRepository.All()
                .Join(_unitOfWork.TranslationRepository.All(), tag => tag.TitleTransId,
                    trans => trans.TranslationId,
                    (tag, translation) => new { Tag = tag, Translation = translation })
                .Where(t => t.Tag.TagCategory.UniqueCode == code &&
                            t.Translation.LanguageId == Constant.DEFAULT_LANGUAGE &&
                            t.Tag.DeletedBy == null)
                .OrderBy(t => t.Tag.Order)
                .Select(t => new OptionViewModel
                {
                    Label = t.Translation.TranslatedText,
                    Value = t.Translation.TranslatedText
                })
                .ToList();

            return masterTags;
        }
        public async Task<CheckUserViewModel> GetUserStatus(Guid id, int langId)
        {
            var totalMember = 0;
            var result = new CheckUserViewModel();
            
            return result;

        }

        public List<User> GetUserListByEmail(string email)
        {
            return _unitOfWork.UserRepository.All().Where(s => s.DeletedBy == null && s.Email == email).ToList();
        }

        public string ChangeRole(Guid userId, UserIdentityViewModel currentUser)
        {
            return string.Empty;
        }

        public void AddUserToRole(Guid userId, string roleName)
        {
            var roleId = _unitOfWork.RoleRepository.All().Where(r => r.Name == roleName).Select(r => r.Id).FirstOrDefault();

            if (roleId != null)
            {
                _unitOfWork.UserRoleRepository.Add(new UserRole
                {
                    RoleId = roleId,
                    UserId = userId
                });
                _unitOfWork.SaveChange();
            }
        }

        public List<User> GetAccountOnwerUserList()
        {
            var r2RoleId = _unitOfWork.RoleRepository.All().FirstOrDefault(s => s.Name == "R2")?.Id;
            var users = _unitOfWork.UserRepository.All().Include(s => s.UserRoles).Where(s => s.DeletedBy == null && s.UserRoles.Any(v => v.RoleId == r2RoleId)).ToList();
            return users;
        }

        public string UpdateUserInfo(UserBasicInfoViewModel model, UserIdentityViewModel cruser)
        {
            //var existed = _unitOfWork.UserRepository.All().Where(s => s.DeletedBy == null && s.CompanyId == cruser.CompanyId).Select(s => s.Email).Any(s => s == model.Email);
            //if (existed)
            //{
            //    return "User.EmailDuplicate";
            //}
            var user = _unitOfWork.UserRepository.All().FirstOrDefault(s => s.DeletedBy == null && s.Id == cruser.UserId);
            user.FirstName = model.FirstName;
            user.LastName = model.LastName;
            user.PhoneNumber = model.Phone;
            //user.Email = model.Email;
            _unitOfWork.SaveChange();

            return string.Empty;

        }
    }
}
