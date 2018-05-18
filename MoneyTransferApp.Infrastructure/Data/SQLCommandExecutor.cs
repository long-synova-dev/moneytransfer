using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MoneyTransferApp.Core.Interfaces;
using System.Data.Common;
using System.Data;

namespace MoneyTransferApp.Infrastructure.Data
{
    public class SQLCommandExecutor : ISQLCommandExecutor
	{
		internal ApplicationDbContext _dbContext;
		public SQLCommandExecutor(ApplicationDbContext context)
		{
			_dbContext = context;
		}

		// Fire and forget (async)
		public async Task ExecuteWithStoreProcedureAsync(string query, params object[] parameters)
		{
			await _dbContext.Database.ExecuteSqlCommandAsync(query, parameters);
		}

		// Fire and forget
		public void ExecuteWithStoreProcedure(string query, params object[] parameters)
		{
			_dbContext.Database.ExecuteSqlCommand(query, parameters);
		}

		public async Task<DataTable> GetDataByCustomCommandAsync(string sql)
		{
			DataTable data = new DataTable();
			var conn = _dbContext.Database.GetDbConnection();
			try
			{
				await conn.OpenAsync();
				using (var command = conn.CreateCommand())
				{
					command.CommandText = sql;
					DbDataReader reader = await command.ExecuteReaderAsync();

					data.Load(reader);

					reader.Dispose();
				}
			}
			finally
			{
				conn.Close();
			}
			return data;
		}

		public DataTable GetDataByCustomCommand(string sql)
		{
			DataTable data = new DataTable();
			var conn = _dbContext.Database.GetDbConnection();
			try
			{
				conn.Open();
				using (var command = conn.CreateCommand())
				{
					command.CommandText = sql;

					DbDataReader reader = command.ExecuteReader();

					data.Load(reader);

					reader.Dispose();
				}
			}
			finally
			{
				conn.Close();
			}
			return data;
		}
	}
}
