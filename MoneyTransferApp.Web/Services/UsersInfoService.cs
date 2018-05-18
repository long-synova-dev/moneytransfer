using System.Linq;
using MoneyTransferApp.Core.Interfaces;
using System.Threading.Tasks;
using MoneyTransferApp.Web.Interfaces;
using MoneyTransferApp.Core.Entities.Dbo;

namespace MoneyTransferApp.Web.Services
{
    public class UsersInfoService : IUsersInfoService
    {
        private IUnitOfWork _unitOfWork;
        public UsersInfoService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<UsersInfo> GetUserInfoByEmail(string email) {
            UsersInfo result = null;

            var q = await _unitOfWork.UsersInfoRepository.List();
            result = q.Where(s => s.Email == email).FirstOrDefault();
            
            return result;
        }
        
        public async Task UpdateUser(UsersInfo user) {
            _unitOfWork.UsersInfoRepository.Update(user);
            _unitOfWork.SaveChange();
        }

        public async Task AddUser(UsersInfo user)
        {
            _unitOfWork.UsersInfoRepository.Update(user);
            _unitOfWork.SaveChange();
        }
    }
}
