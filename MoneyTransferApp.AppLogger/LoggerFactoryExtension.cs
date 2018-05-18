using System;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using MoneyTransferApp.Core.Entities.Internal;

namespace MoneyTransferApp.Logger
{
    public static class LoggerFactoryExtension
	{
		public static ILoggerFactory AddComplyToLogger<TDbContext, TEntity>(this ILoggerFactory factory, IServiceProvider serviceProvider)
			where TDbContext : DbContext
			where TEntity: AppLog, new()
		{
			if (factory == null) throw new ArgumentNullException("factory");

			factory.AddProvider(new LoggerProvider<TDbContext, TEntity>(serviceProvider));

			return factory;
		}
	}
}
