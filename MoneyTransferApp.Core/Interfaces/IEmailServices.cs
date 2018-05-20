using System.Threading.Tasks;

namespace MoneyTransferApp.Core.Interfaces
{
	public interface IEmailServices
	{
		bool SendExceptionError(string message, params object[] args);
		Task<bool> SendMailAsync(string mailAddress, string subject, string message);
	}
}
