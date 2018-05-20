using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using MoneyTransferApp.Auth.Claims;
using MoneyTransferApp.Core.Entities.Users;
using MoneyTransferApp.Web.Common;

namespace MoneyTransferApp.Web.Utilities
{
    public static class ClaimHelper
    {
        public static IEnumerable<Claim> GetClaims(User user, IEnumerable<string> roles)
        {
            //Add claims for all users
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(CustomClaimTypes.Id, user.Id.ToString()),
                new Claim(CustomClaimTypes.Name, user.FirstName + Constant.SPACE + user.LastName),
                new Claim(CustomClaimTypes.PhoneNumber, user.PhoneNumber, ClaimValueTypes.String),
            };

            // Add roles as claims
            claims.AddRange(roles.Select(role => new Claim(CustomClaimTypes.Roles, role, ClaimValueTypes.String)));

            // Add billing plan as claims
            claims.Add(new Claim(CustomClaimTypes.Plan, ClaimValueTypes.String));

            // Return
            return claims;
        }
    }
}
