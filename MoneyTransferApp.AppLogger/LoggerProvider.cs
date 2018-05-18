using System;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using MoneyTransferApp.Core.Entities.Internal;

namespace MoneyTransferApp.Logger
{
	public class LoggerProvider<TDbContext, TEntity> : ILoggerProvider
		where TDbContext : DbContext
		where TEntity: AppLog, new()
	{
		readonly IServiceProvider _serviceProvider;

		public LoggerProvider(IServiceProvider serviceProvider)
		{
			_serviceProvider = serviceProvider;
		}

		public ILogger CreateLogger(string name)
		{
			return new Logger<TDbContext, TEntity>(name, _serviceProvider);
		}

		public void Dispose() { }
	}
}
