using System;
using System.Collections.Generic;
using System.Linq;
using MoneyTransferApp.Core.Entities.Users;
using MoneyTransferApp.Core.Interfaces;
using MoneyTransferApp.Web.Extensions;
using MoneyTransferApp.Web.Interfaces;
using MoneyTransferApp.Web.Models.PagingViewModels;
using MoneyTransferApp.Web.Models.UserViewModels;
using MoneyTransferApp.Web.Models.BaseViewModels;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;

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
                .FirstOrDefault();

            return user;
        }
        
        public User GetUserByToken(Guid token)
        {
            var user = _unitOfWork.UserRepository.All()
                .Where(u => u.SecurityStamp == token.ToString() || u.Id == token)
                .FirstOrDefault();

            return user;
        }
        
        public bool IsUsernameAvailable(string username)
        {
            return _unitOfWork.UserRepository.All().Any(user => user.UserName.Equals(username));
        }

        public User GetUserByPhone_UserName(string input)
        {
            return _unitOfWork.UserRepository.All().FirstOrDefault(s => s.DeletedBy != null
                    && (s.UserName.Equals(input) || s.PhoneNumber.Equals(input)));
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
                                   || user.UserRoles.Any(role => role.Role.Name.Contains(param.Keyword)));
            }

            var data = repository.Select(user => new UserBasicInfoViewModel
            {
                UserId = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Phone = user.PhoneNumber,
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
            var user = _unitOfWork.UserRepository.All().FirstOrDefault(s => s.Id == id);
            user.DeletedBy = CurrentUserIdentity.UserId;
            user.DeletedOn = DateTimeOffset.UtcNow;
            _unitOfWork.UserRepository.Update(user);
            _unitOfWork.SaveChange();
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

        public User GetUserById(Guid id)
        {
            return _unitOfWork.UserRepository.All().FirstOrDefault(s => s.Id.Equals(id));
        }

        public User GetCurentUser(Guid userId)
        {
            return _unitOfWork.UserRepository.All().FirstOrDefault(s => s.DeletedBy == null && s.Id == userId);
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