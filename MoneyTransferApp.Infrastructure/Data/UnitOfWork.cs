using System.Threading.Tasks;
using MoneyTransferApp.Core.Interfaces;
using MoneyTransferApp.Core.Entities.Users;
using MoneyTransferApp.Core.Entities.Client;

namespace MoneyTransferApp.Infrastructure.Data
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ApplicationDbContext _dbContext;
        public UnitOfWork(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        private IRepository<Customer> _customerRepository;
        public IRepository<Customer> CustomerRepository
        {
            get
            {
                return _customerRepository = _customerRepository ?? new EfRepository<Customer>(_dbContext);
            }
        }

        private IRepository<Receiver> _receiverRepository;
        public IRepository<Receiver> ReceiverRepository
        {
            get
            {
                return _receiverRepository = _receiverRepository ?? new EfRepository<Receiver>(_dbContext);
            }
        }

        private IRepository<Transaction> _transactionRepository;
        public IRepository<Transaction> TransactionRepository
        {
            get
            {
                return _transactionRepository = _transactionRepository ?? new EfRepository<Transaction>(_dbContext);
            }
        }

        private IRepository<Role> _roleRepository;
        public IRepository<Role> RoleRepository
        {
            get
            {
                return _roleRepository = _roleRepository ?? new EfRepository<Role>(_dbContext);
            }
        }

        private IRepository<RoleClaim> _roleClaimRepository;
        public IRepository<RoleClaim> RoleClaimRepository
        {
            get
            {
                return _roleClaimRepository = _roleClaimRepository ?? new EfRepository<RoleClaim>(_dbContext);
            }
        }

        private IRepository<UserClaim> _userClaimRepository;
        public IRepository<UserClaim> UserClaimRepository
        {
            get
            {
                return _userClaimRepository = _userClaimRepository ?? new EfRepository<UserClaim>(_dbContext);
            }
        }

        private IRepository<UserRole> _userRoleRepository;
        public IRepository<UserRole> UserRoleRepository
        {
            get
            {
                return _userRoleRepository = _userRoleRepository ?? new EfRepository<UserRole>(_dbContext);
            }
        }

        private IRepository<UserToken> _userTokenRepository;
        public IRepository<UserToken> UserTokenRepository
        {
            get
            {
                return _userTokenRepository = _userTokenRepository ?? new EfRepository<UserToken>(_dbContext);
            }
        }

        private IRepository<UserLogin> _userLoginRepository;
        public IRepository<UserLogin> UserLoginRepository
        {
            get
            {
                return _userLoginRepository = _userLoginRepository ?? new EfRepository<UserLogin>(_dbContext);
            }
        }

        private IRepository<User> _userRepository;
        public IRepository<User> UserRepository
        {
            get
            {
                return _userRepository = _userRepository ?? new EfRepository<User>(_dbContext);
            }
        }

        public void SaveChange()
        {
            _dbContext.SaveChanges();
        }

        public async Task SaveChangeAsync()
        {
            await _dbContext.SaveChangesAsync();
        }
    }
}
