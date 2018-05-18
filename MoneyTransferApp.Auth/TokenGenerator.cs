using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace MoneyTransferApp.Auth
{
    public static class TokenGenerator
    {
        public static object Generate(IEnumerable<Claim> claims, IEnumerable<string> roles, string planId,
            string subscriptionState, bool? inTrial, IConfiguration config, string refreshToken)
        {
            var jwtKey = config["JwtTokens:Key"];
            var jwtIssuer = config["JwtTokens:Issuer"];
            var jwtAudience = config["JwtTokens:Audience"];
            if (!int.TryParse(config["JwtTokens:Expires"], out var expire))
            {
                expire = 30;
            }
            if (!int.TryParse(config["JwtTokens:SessionTime"], out var sessionTime))
            {
                sessionTime = 30;
            }
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(jwtIssuer, jwtAudience, claims, expires: DateTime.Now.AddMinutes(expire),
                signingCredentials: creds);

            return new
            {
                IssueAt = DateTime.Now,
                ExpireAt = expire,
                SessionTime = sessionTime,
                AccessToken = new JwtSecurityTokenHandler().WriteToken(token),
                RefreshToken = refreshToken,
                Roles = roles,
                Plan = planId,
                State = subscriptionState,
                InTrial = inTrial
            };
        }
    }
}
