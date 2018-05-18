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
        public static IEnumerable<Claim> GetClaims(User user, IEnumerable<string> roles, string activePlanId, Guid? companyId = null, string companyNumber = null)
        {
            //Add claims for all users
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(CustomClaimTypes.Id, user.Id.ToString()),
                new Claim(CustomClaimTypes.Name, user.FirstName + Constant.SPACE + user.LastName),
                new Claim(CustomClaimTypes.Email, user.Email, ClaimValueTypes.String),
                new Claim(CustomClaimTypes.Language, (user.LanguageId??Constant.DEFAULT_LANGUAGE).ToString(), ClaimValueTypes.Integer),
                new Claim(CustomClaimTypes.CompanyId, companyId.ToString(), ClaimValueTypes.Integer),
                new Claim(CustomClaimTypes.Locale, user.Language?.LanguageCode, ClaimValueTypes.Integer),
                new Claim(CustomClaimTypes.CompanyNo, companyNumber ?? string.Empty, ClaimValueTypes.String)
            };

            // Add roles as claims
            claims.AddRange(roles.Select(role => new Claim(CustomClaimTypes.Roles, role, ClaimValueTypes.String)));

            // Add billing plan as claims
            claims.Add(new Claim(CustomClaimTypes.Plan, activePlanId, ClaimValueTypes.String));

            // Return
            return claims;
        }
    }
}
