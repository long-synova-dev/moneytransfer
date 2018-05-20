using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using MoneyTransferApp.Auth;
using MoneyTransferApp.Auth.Claims;
using MoneyTransferApp.Core.Entities.Users;
using MoneyTransferApp.Web.Filters;
using MoneyTransferApp.Web.Interfaces;
using MoneyTransferApp.Web.Models.BaseViewModels;
using MoneyTransferApp.Web.Utilities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace MoneyTransferApp.Web.Controllers
{

    [ValidateModelState]
    //[AutoValidateAntiforgeryToken]
    public abstract class BaseController : Controller
    {
        private readonly UserManager<User> _userManager;
        private readonly IUserService _userService;
        private readonly IConfiguration _config;

        protected BaseController(UserManager<User> userManager, IUserService userService, IConfiguration config)
        {
            _userManager = userManager;
            _userService = userService;
            _config = config;
        }

        protected BaseController()
        {
        }

        public UserIdentityViewModel CurrentUserIdentity
        {
            get
            {
                var claims = GetClaimsFromJwtToken();

                if (!claims.Any())
                {
                    return null;
                }

                var user = new UserIdentityViewModel
                {
                    UserId = Guid.Parse(claims.FirstOrDefault(c => c.Type == CustomClaimTypes.Id)?.Value ?? throw new InvalidOperationException("User Id not found in the JWT token") ),
                    FullName = claims.FirstOrDefault(c => c.Type == CustomClaimTypes.Name)?.Value,
                    Email = claims.FirstOrDefault(c => c.Type == CustomClaimTypes.Email)?.Value,
                    Roles = claims.Where(c => c.Type == CustomClaimTypes.Roles).Select(c => c.Value).ToArray(),
                    Locale = claims.FirstOrDefault(c => c.Type == CustomClaimTypes.Locale)?.Value
                };
                return user;
            }
        }

        protected IList<Claim> GetClaimsFromJwtToken()
        {
            // Get value of Authorization header
            var authHeaders = Request.Headers["Authorization"];

            if (!authHeaders.Any())
            {
                return new List<Claim>();
            }

            // Get the JWT token
            var jwtToken = authHeaders[0].Split(' ')[1];
            if (string.IsNullOrWhiteSpace(jwtToken))
            {
                return new List<Claim>();
            }

            // Decrypt the token
            var decrytedToken = new JwtSecurityToken(jwtToken);

            // Return claims
            return decrytedToken.Claims.ToList();
        }

        protected async Task<IActionResult> RefreshUserToken(Guid userId)
        {
            // Look up the user by its refresh token
            var user = _userService.GetUserById(userId);

            if (user == null)
            {
                return Ok(new { Errors = new[] { "UserNotExist" } });
            }

            // Reject if user has been locked out
            if (user.LockoutEnd >= DateTimeOffset.UtcNow)
            {
                return Ok(new { Errors = new[] { "UserLockedOut" } });
            }

            // Get roles of current user
            var roles = await _userManager.GetRolesAsync(user);

            // Generate claims and JWT token
            var claims = ClaimHelper.GetClaims(user, roles);

            // Generate token
            var token = TokenGenerator.Generate(claims, roles, _config, user.SecurityStamp);
            return Ok(token);
        }
    }
}
