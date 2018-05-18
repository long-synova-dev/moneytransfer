using System.Data;
using System.Threading.Tasks;

namespace MoneyTransferApp.Core.Interfaces
{
    public interface ISQLCommandExecutor
    {
		Task ExecuteWithStoreProcedureAsync(string query, params object[] parameters);
		void ExecuteWithStoreProcedure(string query, params object[] parameters);
		Task<DataTable> GetDataByCustomCommandAsync(string sql);
		DataTable GetDataByCustomCommand(string sql);
	}
}
