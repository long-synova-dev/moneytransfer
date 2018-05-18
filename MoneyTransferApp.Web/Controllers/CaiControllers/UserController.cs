using System;
using System.Linq;
using System.Threading.Tasks;
using MoneyTransferApp.Core.Interfaces;
using MoneyTransferApp.Web.Common;
using MoneyTransferApp.Web.Interfaces;
using MoneyTransferApp.Web.Models.UserViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.Text;
using MoneyTransferApp.Core.Entities.Client;
using MoneyTransferApp.Core.Entities.Users;
using MoneyTransferApp.Infrastructure.Common;
using MoneyTransferApp.Web.Models.AuthViewModels;
using Microsoft.Extensions.Configuration;

namespace MoneyTransferApp.Web.Controllers.CaiControllers
{
    [Route("api/[controller]")]
    //[AutoValidateAntiforgeryToken]
    public class UserController : BaseController
    {
        private readonly IUserService _userService;
        private readonly IEmailServices _emailServices;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ILogger<UserController> _logger;
        private readonly IConfiguration _config;

        private readonly UserManager<User> _userManager;

        public UserController(IUserService userService, UserManager<User> userManager, IEmailServices emailServices, ILogger<UserController> logger,
            IHttpContextAccessor httpContextAccessor, IConfiguration config) : base(userManager, userService, config)
        {
            _userService = userService;
            _userManager = userManager;
            _emailServices = emailServices;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
            _config = config;
        }

        /// <summary>
        /// Checks if username exists or not
        /// </summary>
        /// <param name="username"></param>
        /// <returns></returns>
        [HttpGet("[action]")]
        public IActionResult IsUsernameAvailable(string username)
        {
            var result = _userService.IsUsernameAvailable(username);

            return Ok(new { Message = result });
        }

        /// <summary>
        /// Registers for a new user
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost("[action]")]
        [IgnoreAntiforgeryToken]
        public async Task<IActionResult> Register([FromBody] RegisterViewModel model)
        {
            var usersList = _userService.GetAccountOnwerUserList();
            if(usersList.Any(s=>s.Email == model.Email))
            {
                return Ok(new { Errors = "AccountOwnerExisted", IsExisted = true });
            }
            //Instantiate a new application user
            var user = new User
            {
                FirstName = model.FirstName,
                LastName = model.LastName,
                UserName = model.Email,
                Email = model.Email,
                PhoneNumber = model.PhoneNumber,
                LanguageId = model.LanguageId,
                CreatedOn = DateTimeOffset.Now,
            };

            //Create a new user
            user.UserName = Guid.NewGuid().ToString();
            var result = await _userManager.CreateAsync(user, model.Password);

            //If failed, return bad request
            if (!result.Succeeded)
            {
                return Ok(new { Errors = result.Errors.Select(err => err.Code) });
            }

            _userService.AddUserToRole(user.Id, RoleConstant.R2);

            int.TryParse(_config["TrialPeriod"], out var trialDays);

            //Generate a unique company number and add the new company
            var company = new Company
            {
                AccountOwnerId = user.Id,
                CompanyName = model.CompanyName,
                CreatedBy = user.Id,
                CreatedOn = DateTimeOffset.Now,
                VatRegistrationNo = model.VatRegistrationNo,
                CountryVatCode = model.CountryVatCode,
                TrialEndDate = DateTimeOffset.Now.AddDays(trialDays)
            };
            user.CompanyId = company.CompanyId;
            await _userManager.UpdateAsync(user);
            
            //Dont subscribe when log in anymore
            //await _companySubscriptionService.SubscribeCompanyToPlan(subscription, company.CompanyNumber);
            
            await SendEmailConfirm(user, company.CompanyNumber);
            //_emailServices.SendMailWithTemplate((int)NotificationEventEnum.SignUpConfirm, model.LanguageId, user);

            //Return ok
            return Ok(new { Message = "Success" });
        }

        [HttpPost("[action]")]
        [IgnoreAntiforgeryToken]
        public async Task<IActionResult> ConfirmEmail([FromBody] ConfirmEmailViewModel model)
        {
            if (model.Email == null || model.Code == null)
            {
                return Ok(new { Error = "Failed" });
            }
            var newcode = Utils.ConvertHexToString(model.Code, Encoding.Unicode);
            if (string.IsNullOrEmpty(newcode))
            {
                return Ok(new { Error = "InvalidToken" });
            }

            var user = _userService.GetUserByEmail(model.Email, model.CompanyNumber);
            if (user == null)
            {
                _logger.LogError($"Unable to find user with email '{model.Email}'.");
            }
            else
            {
                if (user.EmailConfirmed)
                {
                    return Ok(new { Message = "Success", Show = true });
                }
                var result = await _userManager.ConfirmEmailAsync(user, newcode);
            }

            return Ok(new { Error = "Failed" });
        }

        [HttpPost("[action]")]
        [Authorize(Roles = RoleConstant.CaiRolesOnly)]
        public async Task<IActionResult> ChangeLanguage([FromBody] ChangeLanguageViewModel model)
        {
            _userService.ChangeLanguage(CurrentUserIdentity.UserId, model.LanguageId);

            return await RefreshUserToken(CurrentUserIdentity.UserId);
        }

        [HttpPost("[action]")]
        [IgnoreAntiforgeryToken]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordViewModel model)
        {
            return Ok(new { Message = "Success" });
        }

        [HttpPost("[action]")]
        [IgnoreAntiforgeryToken]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordViewModel model)
        {
            var user = _userService.GetUserByEmail(model.Email, model.CompanyNumber);
            //var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                // Don't reveal that the user does not exist
                return Ok(new { Errors = "ResetPass.EmailNoExisted" });
            }
            user.EmailConfirmed = true;

            var newcode = Utils.ConvertHexToString(model.Code, Encoding.Unicode);
            if (string.IsNullOrEmpty(newcode))
            {
                return Ok(new { Error = "ResetPass.ChangePassFailed" });
            }

            var result = await _userManager.ResetPasswordAsync(user, newcode, model.Password);
            if (result.Succeeded)
            {
                return Ok(new { Message = "ResetPass.Success" });
            }
            return Ok(new { Errors = "ResetPass.ChangePassFailed" });

        }

        [HttpGet("[action]")]
        [Authorize(Roles = RoleConstant.AccountOwnerAndSuperModOnly)]
        public IActionResult GetUserFromLogin()
        {
            var item = _userService.GetUserFromLogin(CurrentUserIdentity.CompanyId.Value);
            item.Data = item.Data;
            return Ok(item.Data);
        }
        
        [HttpPost("[action]")]
        public IActionResult SaveUser([FromBody] UserExtendRegisterViewModel model)
        {

            var ok = _userService.SaveUser(model, CurrentUserIdentity);
            //Return ok
            return Ok(ok);
        }

        [HttpDelete("[action]/{id}")]
        public IActionResult DeleteUser(string id)
        {
            var Id = Guid.Parse(id);
            _userService.DeleteUser(Id, CurrentUserIdentity);
            return Ok(new { Message = "Success" });
        }


        [HttpGet("[action]")]
        [Authorize(Roles = RoleConstant.CaiRolesOnly)]
        public IActionResult GetUsersInCompany()
        {
            var users = _userService.GetUsersInCompany(CurrentUserIdentity.CompanyId);
            return Ok(users);
        }

        [HttpGet("[action]")]
        public IActionResult GetRoles()
        {
            var roles = _userService.GetRoles();
            return Ok(roles.Where(s => s.label != "Account Owner"));
        }

        [HttpGet("[action]/{id}")]
        public IActionResult GetUserById(Guid id)
        {
            var item = _userService.GetUSerById(id, CurrentUserIdentity);
            return Ok(item);
        }

        [HttpGet("[action]/{code}")]
        public IActionResult GetCategoryByCode(string code)
        {
            var tags = _userService.GetCategoryByCode(code);
            return Ok(tags);
        }

        [HttpPost("[action]")]
        public IActionResult SendInvitation([FromBody] UserExtendInfoViewModel user)
        {
            return Ok(_userService.ResendEmail(user));
        }

        [HttpGet("[action]")]
        public async Task<IActionResult> GetUserStatus()
        {
            var companyId = Guid.Parse(CurrentUserIdentity.CompanyId.ToString());
            var langId = CurrentUserIdentity.Language;
            var result = await _userService.GetUserStatus(companyId, langId);
            return Ok(result);
        }

        [HttpGet("[action]")]
        public IActionResult GetMaximumUser()
        {
            return Ok(_userService.GetMaximumUsers(CurrentUserIdentity));
        }

        [HttpPost("[action]/{id}")]
        public IActionResult ChangeRole(Guid id)
        {
            var result = _userService.ChangeRole(id, CurrentUserIdentity);
            return Ok(new { Error = result });
        }

        [HttpPost("[action]")]
        public IActionResult UpdateUserInfo([FromBody] UserBasicInfoViewModel model)
        {
            //var usersList = _userService.GetAccountOnwerUserList();
            //if (usersList.Any(s => s.Email == model.Email))
            //{
            //    return Ok(new { Errors = "AccountOwnerExisted" });
            //}
            var result = _userService.UpdateUserInfo(model, CurrentUserIdentity);

            return Ok(string.IsNullOrEmpty(result) ? new { Errors = string.Empty } : new { Errors = result });
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordViewModel model)
        {
            var user = _userService.GetCurentUser(CurrentUserIdentity.UserId);
            var correctPassword = await _userManager.CheckPasswordAsync(user, model.OldPassword);
            if(!correctPassword)
            {
                return Ok(new { Errors = "PasswordIncorrect" });
            }
            await _userManager.ChangePasswordAsync(user, model.OldPassword, model.NewPassword);
            return Ok(new { Errors = string.Empty });
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> ResendEmailConfirm([FromBody] GenerateTokenViewModel model)
        {
            var user = _userService.GetUserByEmail(model.Email, model.CompanyNumber);
            if (user == null)
            {
                return new OkObjectResult(new { Errors = new[] { "IncorrectLogin" } });
            }
            await SendEmailConfirm(user, model.CompanyNumber);
            return Ok(new { Message = "Success" });
        }

        private async Task SendEmailConfirm(User user, string companyNumber)
        {
            
        }
    }
}
