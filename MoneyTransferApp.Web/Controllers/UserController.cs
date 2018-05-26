using System;
using System.Linq;
using System.Threading.Tasks;
using MoneyTransferApp.Core.Interfaces;
using MoneyTransferApp.Web.Common;
using MoneyTransferApp.Web.Interfaces;
using MoneyTransferApp.Web.Models.UserViewModels;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using MoneyTransferApp.Core.Entities.Users;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Authorization;

namespace MoneyTransferApp.Web.Controllers
{
    [Route("api/[controller]")]
    [Authorize(Roles = RoleConstant.GodOnly)]
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
        public async Task<IActionResult> CreateAccount([FromBody] RegisterViewModel model)
        {
            var usersList = _userService.GetUserByPhone_UserName(model.UserName);
            if(usersList != null)
            {
                return Ok(new { Errors = "AccountExisted", IsExisted = true });
            }
            //Instantiate a new application user
            var user = new User
            {
                FirstName = model.FirstName,
                LastName = model.LastName,
                UserName = model.UserName,
                Email = model.Email,
                PhoneNumber = model.PhoneNumber,
                CreatedOn = DateTimeOffset.Now,
            };

            //Create a new user
            var result = await _userManager.CreateAsync(user, model.Password);

            //If failed, return bad request
            if (!result.Succeeded)
            {
                return Ok(new { Errors = result.Errors.Select(err => err.Code) });
            }

            _userService.AddUserToRole(user.Id, RoleConstant.R2);
            user.EmailConfirmed = true;
            await _userManager.UpdateAsync(user);
            
            //Return ok
            return Ok(new { Message = "Success" });
        }
        
        [HttpDelete("[action]/{id}")]
        public IActionResult DeleteUser(string id)
        {
            var Id = Guid.Parse(id);
            _userService.DeleteUser(Id, CurrentUserIdentity);
            return Ok(new { Message = "Success" });
        }
        
        [HttpGet("[action]/{id}")]
        public IActionResult GetUserById(Guid id)
        {
            var item = _userService.GetUserById(id);
            return Ok(item);
        }
        
        [HttpPost("[action]")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordViewModel model)
        {
            var user = _userService.GetUserById(CurrentUserIdentity.UserId);
            var correctPassword = await _userManager.CheckPasswordAsync(user, model.OldPassword);
            if(!correctPassword)
            {
                return Ok(new { Errors = "PasswordIncorrect" });
            }
            await _userManager.ChangePasswordAsync(user, model.OldPassword, model.NewPassword);
            return Ok(new { Errors = string.Empty });
        }

        [HttpPost("[action]")]
        [Authorize(Roles = RoleConstant.AllRoles)]
        public async Task<IActionResult> ChangeLanguage([FromBody] ChangeLanguageViewModel model)
        {
            _userService.ChangeLanguage(CurrentUserIdentity.UserId, model.LanguageId);

            return await RefreshUserToken(CurrentUserIdentity.UserId);
        }
    }
}
