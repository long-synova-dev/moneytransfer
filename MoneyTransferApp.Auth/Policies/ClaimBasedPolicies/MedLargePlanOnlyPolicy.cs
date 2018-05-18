using MoneyTransferApp.Auth.Claims;
using Microsoft.AspNetCore.Authorization;

namespace MoneyTransferApp.Auth.Policies.ClaimBasedPolicies
{
    public class MedLargePlanOnlyPolicy : IAuthPolicy
    {
        public string Name => PolicyNames.AllPlansPolicy;
        public AuthorizationPolicy Policy => new AuthorizationPolicyBuilder().RequireClaim(CustomClaimTypes.Plan, "medium", "large").Build();
    }
}
