using System.Threading.Tasks;
using MoneyTransferApp.Core.Entities.Dbo;

namespace MoneyTransferApp.Web.Interfaces
{
    public interface IUsersInfoService
    {
        Task<UsersInfo> GetUserInfoByEmail(string email);
        Task AddUser(UsersInfo user);
        Task UpdateUser(UsersInfo user);
    }
}
