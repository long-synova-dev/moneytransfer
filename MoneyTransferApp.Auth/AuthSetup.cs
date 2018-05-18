using System;
using System.Linq;
using MoneyTransferApp.Auth.Policies;
using Microsoft.Extensions.DependencyInjection;

namespace MoneyTransferApp.Auth
{
    public class AuthSetup
    {
        public static void ConfigureAuthorization(IServiceCollection services)
        {
            //Get all policies that implements the IAuthPolicy interface
            var type = typeof(IAuthPolicy);
            var policyTypes = AppDomain.CurrentDomain.GetAssemblies()
              .SelectMany(s => s.GetTypes())
              .Where(p => type.IsAssignableFrom(p) && !p.IsAbstract);

            //Add each policy to the authentication service
            services.AddAuthorization(options =>
            {
                foreach (var policyType in policyTypes)
                {
                    var policyObj = Activator.CreateInstance(policyType) as IAuthPolicy;
                    if (policyObj == null)
                    {
                        continue;
                    }

                    options.AddPolicy(policyObj.Name, policyObj.Policy);
                }
            });
        }
    }
}
