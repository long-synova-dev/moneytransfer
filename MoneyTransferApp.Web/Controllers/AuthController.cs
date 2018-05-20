using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using MoneyTransferApp.Web.Utilities;
using MoneyTransferApp.Auth;
using MoneyTransferApp.Core.Entities.Users;
using MoneyTransferApp.Web.Common;
using MoneyTransferApp.Web.Models.AuthViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MoneyTransferApp.Web.Interfaces;

namespace MoneyTransferApp.Web.Controllers
{
    [Route("api/[controller]")]
    public class AuthController : BaseController
    {
        private const string FilePath = "IPBanList.txt";
        private readonly SignInManager<User> _signInManager;
        private readonly UserManager<User> _userManager;
        private readonly IUserService _userService;
        private readonly IConfiguration _config;
        private readonly IHttpContextAccessor _httpContextAccessor;
        
        public AuthController(UserManager<User> userManager, IConfiguration config, SignInManager<User> signInManager,
            IUserService userService, IHttpContextAccessor httpContextAccessor): base(userManager, userService, config)
        {
            _userManager = userManager;
            _config = config;
            _signInManager = signInManager;
            _userService = userService;
            _httpContextAccessor = httpContextAccessor;
        }

        /// <summary>
        /// Verifies username and password then generates a JWT token if user is a CAI user
        /// </summary>
        /// <param name="model">GenerateTokenViewModel</param>
        /// <returns></returns>
        [HttpPost("[action]")]
        [IgnoreAntiforgeryToken]
        public async Task<IActionResult> GenerateToken([FromBody] GenerateTokenViewModel model)
        {
            var user = _userService.GetUserByPhone_UserName(model.UserName);
            if (user == null)
            {
                return new OkObjectResult(new { Errors = new[] { "IncorrectLogin" } });
            }
            return await GenerateTokenWithRoles(user, model, RoleConstant.AllRoleList);
        }
        
        /// <summary>
        /// Verifies the refresh token and reissue a new token
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost("[action]")]
        [Authorize(Roles = RoleConstant.AllRoles)]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenViewModel model)
        {
            return await RefreshUserToken(model.RefreshToken);
        }

        [HttpPost("[action]")]
        [IgnoreAntiforgeryToken]
        [Authorize(Roles = RoleConstant.AllRoles)]
        public async Task<IActionResult> Logout()
        {
            // Get the current user
            var userName = CurrentUserIdentity.Email;
            var user = await _userManager.FindByEmailAsync(userName);

            if (user == null)
            {
                return new OkObjectResult(new { Errors = new[] { "UserNotExist" } });
            }

            // return 200
            return Ok();
        }

        [HttpGet("[action]")]
        [Authorize(Roles = RoleConstant.AllRoles)]
        public IActionResult CurrentUser()
        {
            //throw new Exception();
            return Ok(CurrentUserIdentity);
        }

        [HttpGet("[action]")]
        public IActionResult CheckIpAddress()
        {
            if (!System.IO.File.Exists(FilePath))
                System.IO.File.Create(FilePath);
            var file = new FileInfo(FilePath);
            using (var reader = new StreamReader(file.Open(FileMode.Open, FileAccess.Read, FileShare.ReadWrite)))
            {
                var r = reader.ReadToEnd();
                var content = r.Replace(Environment.NewLine, string.Empty);
                var ipBanList = content.Split(',').ToList();
                var clientIP = GetClientIPAddress();
                if (ipBanList.Any(s => RemoveTheLastIPNumber(s).Equals(clientIP)))
                {
                    return StatusCode(403);
                }
            }
            return StatusCode(200);
        }

        #region Private methods

        private async Task<IActionResult> GenerateTokenWithRoles(User user, GenerateTokenViewModel model, List<string> requiredRoles)
        {
            if (user == null)
            {
                return Ok(new { Errors = new[] { "IncorrectLogin" } });
            }

            //// Verify the password provided
            var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, true);

            if (result.IsLockedOut)
            {
                return Ok(user.LockoutEnd == DateTimeOffset.MaxValue
                    ? new { Errors = new[] { "UserDeactivated" } }
                    : new { Errors = new[] { "UserLockedOut" } });
            }
            if (result.IsNotAllowed)
            {
                return Ok(new { Errors = new[] { "EmailNotConfirmed" } });
            }
            if (!result.Succeeded)
            {
                await _userManager.AccessFailedAsync(user);
                return Ok(new { Errors = new[] { "IncorrectLogin" } });
            }
            
            var activePlanId = string.Empty;
            
            // Get roles of current user
            var roles = await _userManager.GetRolesAsync(user);
            if (!requiredRoles.Any(requiredRole => roles.Contains(requiredRole)))
            {
                return Ok(new { Errors = new[] { "UnauthorizedRole" } });
            }

            // Generate claims and JWT token
            var claims = ClaimHelper.GetClaims(user, roles);
            _userService.UpdateLastLogin(user.Id);
            // Generate token
            var token = TokenGenerator.Generate(claims, roles, _config, user.SecurityStamp);
            return Ok(token);
        }

        private string GetClientIPAddress()
        {
            string clientIP = _httpContextAccessor.HttpContext.Connection.RemoteIpAddress.ToString();
            return RemoveTheLastIPNumber(clientIP);
        }

        private string RemoveTheLastIPNumber(string ipValue)
        {
            var lastIndex = ipValue.LastIndexOf(".", StringComparison.OrdinalIgnoreCase);
            return ipValue.Substring(0, lastIndex);
        }

        #endregion Private methods#
    }
}
