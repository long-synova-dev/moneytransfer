using System.Threading.Tasks;
using MoneyTransferApp.Core.Entities.Users;
using MoneyTransferApp.Core.Entities.Client;

namespace MoneyTransferApp.Core.Interfaces
{
    public interface IUnitOfWork
    {
		IRepository<Customer> CustomerRepository { get; }
		IRepository<Receiver> ReceiverRepository { get; }
		IRepository<Transaction> TransactionRepository { get; }
		IRepository<Role> RoleRepository { get; }
		IRepository<RoleClaim> RoleClaimRepository { get; }
		IRepository<User> UserRepository { get; }
		IRepository<UserClaim> UserClaimRepository { get; }
		IRepository<UserLogin> UserLoginRepository { get; }
		IRepository<UserRole> UserRoleRepository { get; }
		IRepository<UserToken> UserTokenRepository { get; }
		
        void SaveChange();
		Task SaveChangeAsync();
    }
}
