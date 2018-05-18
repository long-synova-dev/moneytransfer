using Microsoft.AspNetCore.Authorization;

namespace MoneyTransferApp.Auth.Policies
{
    public interface IAuthPolicy
    {
        string Name { get; }

        AuthorizationPolicy Policy { get; }
    }
}
