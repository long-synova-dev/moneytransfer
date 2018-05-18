using System.Threading.Tasks;

namespace MoneyTransferApp.Core.Interfaces
{
	public interface IEmailServices
	{
		bool SendExceptionError(string message, params object[] args);
        bool SendMailWithTemplate(int eventId, int? languageId, string recipientEmail, string subjectData = "", string bodyData = "");
		Task<bool> SendMailAsync(string mailAddress, string subject, string message);
	}
}
